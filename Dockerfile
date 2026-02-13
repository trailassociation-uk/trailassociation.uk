FROM oven/bun:1.3 AS deps
WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile


FROM oven/bun:1.3 AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

COPY . .

RUN bun run build


FROM oven/bun:1.3 AS runner
WORKDIR /app

RUN groupadd --system --gid 999 nuxt && \
    useradd --system --uid 999 --gid nuxt nuxt

COPY --from=builder --chown=999:999 /app/.output ./.output

USER nuxt

EXPOSE 3000

ENV NITRO_PORT=3000
ENV NODE_ENV=production

CMD ["bun", ".output/server/index.mjs"]
