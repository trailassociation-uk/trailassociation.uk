<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const { user, fetch: refreshSession } = useUserSession();

const profile = ref<{ id: number; email: string } | null>(null);
const profileLoading = ref(true);

const emailForm = reactive({
  email: "",
});
const emailError = ref<string | null>(null);
const emailLoading = ref(false);
const emailSuccess = ref(false);

const passwordForm = reactive({
  currentPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
});
const passwordError = ref<string | null>(null);
const passwordLoading = ref(false);
const passwordSuccess = ref(false);

function extractErrorMessage(e: unknown): string {
  if (e && typeof e === "object" && "data" in e) {
    const data = (e as { data?: { message?: string } }).data;
    return data?.message ?? "Something went wrong.";
  }
  return "Something went wrong.";
}

async function fetchProfile() {
  try {
    profile.value = await $fetch("/api/profile");
    emailForm.email = profile.value?.email ?? "";
  } catch {
    profile.value = null;
  } finally {
    profileLoading.value = false;
  }
}

async function onEmailSubmit() {
  emailError.value = null;
  emailSuccess.value = false;
  emailLoading.value = true;
  try {
    await $fetch("/api/profile/email", {
      method: "PATCH",
      body: { email: emailForm.email },
    });
    await refreshSession();
    emailSuccess.value = true;
  } catch (e: unknown) {
    emailError.value = extractErrorMessage(e);
  } finally {
    emailLoading.value = false;
  }
}

const passwordsMatch = computed(
  () =>
    passwordForm.newPassword === passwordForm.newPasswordConfirm &&
    passwordForm.newPassword.length >= 8
);

async function onPasswordSubmit() {
  if (!passwordsMatch.value) return;
  passwordError.value = null;
  passwordSuccess.value = false;
  passwordLoading.value = true;
  try {
    await $fetch("/api/profile/password", {
      method: "PATCH",
      body: {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      },
    });
    passwordSuccess.value = true;
    passwordForm.currentPassword = "";
    passwordForm.newPassword = "";
    passwordForm.newPasswordConfirm = "";
  } catch (e: unknown) {
    passwordError.value = extractErrorMessage(e);
  } finally {
    passwordLoading.value = false;
  }
}

onMounted(async () => {
  if (!user.value) {
    await navigateTo("/login", { replace: true });
    return;
  }
  await fetchProfile();
});

watch(user, (u) => {
  if (!u && !profileLoading.value) {
    navigateTo("/login", { replace: true });
  }
});
</script>

<template>
  <main class="flex flex-1 flex-col items-center justify-center px-4 pt-24 pb-16">
    <div v-if="profileLoading" class="text-muted-foreground">
      Loading...
    </div>

    <div v-else-if="profile" class="w-full max-w-sm space-y-10">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Profile</h1>
        <p class="mt-2 text-muted-foreground">
          Update your account information
        </p>
      </div>

      <section class="space-y-4">
        <form class="space-y-4" @submit.prevent="onEmailSubmit">
          <Field>
            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <Input v-model="emailForm.email" type="email" placeholder="you@example.com" required
                autocomplete="email" />
            </FieldGroup>
          </Field>
          <div class="flex flex-col gap-2">
            <Button type="submit" :disabled="emailLoading">
              {{ emailLoading ? "Updating..." : "Update email" }}
            </Button>
            <p v-if="emailError" class="text-sm text-destructive" role="alert">
              {{ emailError }}
            </p>
            <p v-if="emailSuccess" class="text-sm text-green-600" role="status">
              Email updated successfully.
            </p>
          </div>
        </form>
      </section>

      <section class="space-y-4">
        <form class="space-y-4" @submit.prevent="onPasswordSubmit">
          <Field>
            <FieldGroup>
              <FieldLabel>Current password</FieldLabel>
              <Input v-model="passwordForm.currentPassword" type="password" placeholder="••••••••" required
                minlength="8" autocomplete="current-password" />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <FieldLabel>New password</FieldLabel>
              <Input v-model="passwordForm.newPassword" type="password" placeholder="••••••••" required minlength="8"
                autocomplete="new-password" />
              <FieldError />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <FieldLabel>Confirm new password</FieldLabel>
              <Input v-model="passwordForm.newPasswordConfirm" type="password" placeholder="••••••••" required
                minlength="8" autocomplete="new-password" />
              <FieldError />
            </FieldGroup>
          </Field>
          <div class="flex flex-col gap-2">
            <Button type="submit" :disabled="passwordLoading || !passwordsMatch">
              {{ passwordLoading ? "Updating..." : "Update password" }}
            </Button>
            <p v-if="passwordError" class="text-sm text-destructive" role="alert">
              {{ passwordError }}
            </p>
            <p v-if="passwordSuccess" class="text-sm text-green-600" role="status">
              Password updated successfully.
            </p>
          </div>
        </form>
      </section>
    </div>
  </main>
</template>
