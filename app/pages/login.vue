<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { fetch: refreshSession } = useUserSession();

const form = reactive({
  email: "",
  password: "",
});

const error = ref<string | null>(null);
const loading = ref(false);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: form,
    });
    await refreshSession();
    await navigateTo("/");
  } catch (e: unknown) {
    if (e && typeof e === "object" && "data" in e) {
      const data = (e as { data?: { message?: string } }).data;
      error.value = data?.message ?? "Invalid email or password.";
    } else {
      error.value = "Invalid email or password.";
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Sign in</h1>
        <p class="mt-2 text-muted-foreground">
          Don't have an account?
          <NuxtLink to="/signup" class="font-medium text-primary underline-offset-4 hover:underline">
            Sign up
          </NuxtLink>
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <Field>
          <FieldGroup>
            <FieldLabel>Email</FieldLabel>
            <Input v-model="form.email" type="email" placeholder="you@example.com" required autocomplete="email" />
          </FieldGroup>
        </Field>

        <Field>
          <FieldGroup>
            <FieldLabel>Password</FieldLabel>
            <Input v-model="form.password" type="password" placeholder="••••••••" required minlength="8"
              autocomplete="current-password" />
          </FieldGroup>
        </Field>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Signing in..." : "Sign in" }}
        </Button>

        <p v-if="error" class="text-sm text-destructive" role="alert">
          {{ error }}
        </p>
      </form>
    </div>
  </main>
</template>
