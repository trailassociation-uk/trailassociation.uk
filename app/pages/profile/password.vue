<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { extractErrorMessage } from "@/lib/utils";

definePageMeta({ middleware: "auth" });

const form = reactive({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});
const error = ref<string | null>(null);
const loading = ref(false);
const success = ref(false);


const passwordsMatch = computed(
  () =>
    form.newPassword === form.newPasswordConfirm &&
    form.newPassword.length >= 8
);

async function onSubmit() {
  if (!passwordsMatch.value) return;
  error.value = null;
  success.value = false;
  loading.value = true;
  try {
    await $fetch("/api/profile/password", {
      method: "PATCH",
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      },
    });
    success.value = true;
    form.currentPassword = "";
    form.newPassword = "";
    form.newPasswordConfirm = "";
  } catch (e: unknown) {
    error.value = extractErrorMessage(e);
  } finally {
    loading.value = false;
  }
}

</script>

<template>
  <main class="flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16">
    <div class="w-full max-w-sm space-y-8">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Change password</h1>
        <p class="mt-2 text-muted-foreground">
          <NuxtLink to="/profile" class="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to profile
          </NuxtLink>
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <Field>
          <FieldGroup>
            <FieldLabel>Current password</FieldLabel>
            <Input v-model="form.currentPassword" type="password" placeholder="••••••••" required minlength="8"
              autocomplete="current-password" />
          </FieldGroup>
        </Field>
        <Field>
          <FieldGroup>
            <FieldLabel>New password</FieldLabel>
            <Input v-model="form.newPassword" type="password" placeholder="••••••••" required minlength="8"
              autocomplete="new-password" />
            <FieldError />
          </FieldGroup>
        </Field>
        <Field>
          <FieldGroup>
            <FieldLabel>Confirm new password</FieldLabel>
            <Input v-model="form.newPasswordConfirm" type="password" placeholder="••••••••" required minlength="8"
              autocomplete="new-password" />
            <FieldError />
          </FieldGroup>
        </Field>
        <div class="flex flex-col gap-2">
          <Button type="submit" :disabled="loading || !passwordsMatch">
            {{ loading ? "Updating..." : "Update password" }}
          </Button>
          <p v-if="error" class="text-sm text-destructive" role="alert">
            {{ error }}
          </p>
          <p v-if="success" class="text-sm text-green-600" role="status">
            Password updated successfully.
          </p>
        </div>
      </form>
    </div>
  </main>
</template>
