<script lang="ts">
  import { Section, Register } from "flowbite-svelte-blocks";
  import { Button, Checkbox, Label, Input } from "flowbite-svelte";
  import { MapLocationOutline } from "flowbite-svelte-icons";

  import { goto } from "$app/navigation";

  import { pb, user } from "$lib/pocketbase";

  if ($user) {
    goto("/");
  }

  async function login(e) {
    const formData = new FormData(e.target);

    const { record, token } = await pb
      .collection("maintainers")
      .authWithPassword(formData.get("email") as string, formData.get("password") as string);

    pb.authStore.save(token, record);

    $user = record;

    if (record) {
      goto("/");
    }
  }
</script>

<div
  class="h-screen bg-[url('https://images.unsplash.com/photo-1516214104703-d870798883c5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover"
>
  <div class="mx-auto max-w-xl py-12">
    <Section name="login">
      <Register href="/">
        <svelte:fragment slot="top">
          <MapLocationOutline class="mx-2 text-red-600 dark:text-red-500" size="xl" />
        </svelte:fragment>
        <div class="space-y-4 p-6 sm:p-8 md:space-y-6">
          <form class="flex flex-col space-y-6" on:submit|preventDefault={login}>
            <h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">Login</h3>
            <Label class="space-y-2">
              <span>Email</span>
              <Input type="email" name="email" placeholder="you@email.com" required />
            </Label>
            <Label class="space-y-2">
              <span>Password</span>
              <Input type="password" name="password" placeholder="•••••••••••••••" required />
            </Label>
            <div class="flex items-start">
              <Checkbox>Remember me</Checkbox>
              <a href="/" class="ml-auto text-sm text-blue-700 hover:underline dark:text-blue-500"
                >Forgot password?</a
              >
            </div>
            <Button type="submit" class="w-full1">Sign in</Button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              Don’t have an account yet? <a
                href="/signup"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Sign up</a
              >
            </p>
          </form>
        </div>
      </Register>
    </Section>
  </div>
</div>
