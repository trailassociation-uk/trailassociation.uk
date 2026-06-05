#!/usr/bin/env bun
/**
 * Manage `*.<dev host>` subdomain entries in the system hosts file so the
 * subdomain-resolution middleware can be tested locally without real DNS.
 *
 * Usage:
 *   bun run hosts list
 *   bun run hosts add <subdomain> [<subdomain> ...]
 *   bun run hosts remove <subdomain> [<subdomain> ...]
 *
 * Entries are kept inside a managed block so this script never touches the rest
 * of your hosts file. The block always includes the apex host and its `www`
 * alias; any commands add/remove subdomains alongside them. Writing requires
 * elevated privileges, e.g.:
 *   sudo bun run hosts add peak
 */
import { readFileSync, writeFileSync } from "node:fs";

// Apex host used for local dev. Set `NUXT_HOST` in `.env` to match the host the
// app derives subdomains from (see `nuxt.config.ts`).
const DEV_HOST = process.env.NUXT_HOST ?? "trailassociation.local";

const HOSTS_PATH = process.env.HOSTS_FILE ?? "/etc/hosts";
const BLOCK_START = "# >>> trailassociation.uk dev subdomains >>>";
const BLOCK_END = "# <<< trailassociation.uk dev subdomains <<<";

// Always present in the managed block: the apex host and its `www` alias, so the
// dev site (and the apex/`www` "no association" path) resolves out of the box.
const BASE_HOSTS = [DEV_HOST, `www.${DEV_HOST}`];

const usage = `Usage:
  bun run hosts init
  bun run hosts list
  bun run hosts add <subdomain> [<subdomain> ...]
  bun run hosts remove <subdomain> [<subdomain> ...]

Writing to ${HOSTS_PATH} requires sudo, e.g. \`sudo bun run hosts add peak\`.`;

function normalize(subdomain: string): string {
  const value = subdomain
    .trim()
    .toLowerCase()
    .replace(new RegExp(`\\.${DEV_HOST}$`), "");
  if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/.test(value)) {
    throw new Error(`Invalid subdomain: "${subdomain}"`);
  }
  return value;
}

function readManagedSubdomains(contents: string): Set<string> {
  const start = contents.indexOf(BLOCK_START);
  const end = contents.indexOf(BLOCK_END);
  const subdomains = new Set<string>();
  if (start === -1 || end === -1 || end < start) return subdomains;

  const block = contents.slice(start + BLOCK_START.length, end);
  const lineRe = new RegExp(`^127\\.0\\.0\\.1\\s+(\\S+)\\.${DEV_HOST}$`);
  for (const line of block.split("\n")) {
    const match = line.trim().match(lineRe);
    // `www` is part of the always-present base hosts, not a user subdomain.
    if (match && match[1] !== "www") subdomains.add(match[1]);
  }
  return subdomains;
}

function writeManagedSubdomains(subdomains: Set<string>): void {
  let contents = "";
  try {
    contents = readFileSync(HOSTS_PATH, "utf8");
  } catch {
    // hosts file will be created if it does not exist
  }

  // Strip any existing managed block.
  const start = contents.indexOf(BLOCK_START);
  const end = contents.indexOf(BLOCK_END);
  if (start !== -1 && end !== -1 && end >= start) {
    const before = contents.slice(0, start).replace(/\n+$/, "");
    const after = contents.slice(end + BLOCK_END.length).replace(/^\n+/, "");
    contents = [before, after].filter(Boolean).join("\n");
  }

  // The block always carries the base hosts (apex + www), plus any user
  // subdomains, so it is written even when there are no user subdomains.
  const hosts = [
    ...BASE_HOSTS,
    ...[...subdomains]
      .filter((s) => s !== "www")
      .sort()
      .map((s) => `${s}.${DEV_HOST}`),
  ];
  const lines = hosts.map((host) => `127.0.0.1\t${host}`);
  const next = `${contents.replace(/\n+$/, "")}\n\n${BLOCK_START}\n${lines.join("\n")}\n${BLOCK_END}`.replace(
    /^\n+/,
    "",
  );

  try {
    writeFileSync(HOSTS_PATH, `${next}\n`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "EACCES") {
      console.error(
        `Permission denied writing ${HOSTS_PATH}. Re-run with sudo.`,
      );
      process.exit(1);
    }
    throw err;
  }
}

function main(): void {
  const [command, ...args] = process.argv.slice(2);

  if (!command || command === "help" || command === "--help") {
    console.log(usage);
    return;
  }

  if (command === "init") {
    let contents = "";
    try {
      contents = readFileSync(HOSTS_PATH, "utf8");
    } catch {
      // fine — file may not exist yet
    }
    // Rewriting the block re-seeds the base hosts (apex + www) while keeping any
    // user subdomains already present.
    writeManagedSubdomains(readManagedSubdomains(contents));
    console.log(`Seeded base hosts: ${BASE_HOSTS.join(", ")}`);
    return;
  }

  if (command === "list") {
    const contents = readFileSync(HOSTS_PATH, "utf8");
    const subdomains = [...readManagedSubdomains(contents)].sort();
    if (subdomains.length === 0) {
      console.log("No managed dev subdomains.");
      return;
    }
    for (const s of subdomains) console.log(`${s}.${DEV_HOST}`);
    return;
  }

  if (command !== "add" && command !== "remove") {
    console.error(`Unknown command: "${command}"\n\n${usage}`);
    process.exit(1);
  }

  if (args.length === 0) {
    console.error(`"${command}" needs at least one subdomain.\n\n${usage}`);
    process.exit(1);
  }

  const targets = args.map(normalize);
  let contents = "";
  try {
    contents = readFileSync(HOSTS_PATH, "utf8");
  } catch {
    // fine — file may not exist yet
  }
  const subdomains = readManagedSubdomains(contents);

  for (const target of targets) {
    if (command === "add") subdomains.add(target);
    else subdomains.delete(target);
  }

  writeManagedSubdomains(subdomains);

  const action = command === "add" ? "Added" : "Removed";
  console.log(
    `${action}: ${targets.map((t) => `${t}.${DEV_HOST}`).join(", ")}`,
  );
}

main();
