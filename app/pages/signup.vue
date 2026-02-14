<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { fetch: refreshSession } = useUserSession();

const form = reactive({
  email: "",
  password: "",
  passwordConfirm: "",
});

const error = ref<string | null>(null);
const loading = ref(false);

async function onSubmit() {
  error.value = null;
  loading.value = true;
  try {
    await $fetch("/api/auth/signup", {
      method: "POST",
      body: form,
    });
    await refreshSession();
    await navigateTo("/");
  } catch (e: unknown) {
    error.value = "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Create an account</h1>
        <p class="mt-2 text-muted-foreground">
          Already have an account?
          <NuxtLink to="/login" class="font-medium text-primary underline-offset-4 hover:underline">
            Sign in
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
              autocomplete="new-password" />
            <FieldError />
          </FieldGroup>
        </Field>

        <Field>
          <FieldGroup>
            <FieldLabel>Confirm password</FieldLabel>
            <Input v-model="form.passwordConfirm" type="password" placeholder="••••••••" required minlength="8"
              autocomplete="new-password" />
            <FieldError />
          </FieldGroup>
        </Field>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Creating account..." : "Sign up" }}
        </Button>

        <p v-if="error" class="text-sm text-destructive" role="alert">
          {{ error }}
        </p>
      </form>
    </div>
  </main>
</template>
