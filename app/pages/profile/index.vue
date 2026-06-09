<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { extractErrorMessage } from "@/lib/utils";

definePageMeta({ middleware: "auth" });

const { fetch: refreshSession } = useUserSession();

const { data: profile, pending: profileLoading, refresh: refreshProfile } = await useAsyncData(
  "profile",
  () => $fetch<{ id: string; email: string; name: string }>("/api/profile"),
);

const detailsForm = reactive({
  name: profile.value?.name ?? "",
  email: profile.value?.email ?? "",
});
const detailsError = ref<string | null>(null);
const detailsLoading = ref(false);
const detailsSuccess = ref(false);

async function onDetailsSubmit() {
  detailsError.value = null;
  detailsSuccess.value = false;
  detailsLoading.value = true;
  try {
    const updates: { name?: string; email?: string } = {};
    if (detailsForm.name !== profile.value?.name) updates.name = detailsForm.name;
    if (detailsForm.email !== profile.value?.email) updates.email = detailsForm.email;

    if (Object.keys(updates).length > 0) {
      await $fetch("/api/profile", {
        method: "PATCH",
        body: updates,
      });
    }

    await refreshSession();
    await refreshProfile();
    detailsSuccess.value = true;
  } catch (e: unknown) {
    detailsError.value = extractErrorMessage(e);
  } finally {
    detailsLoading.value = false;
  }
}
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
        <form class="space-y-4" @submit.prevent="onDetailsSubmit">
          <Field>
            <FieldGroup>
              <FieldLabel>Name</FieldLabel>
              <Input v-model="detailsForm.name" type="text" placeholder="Your name" required autocomplete="name" />
            </FieldGroup>
          </Field>
          <Field>
            <FieldGroup>
              <FieldLabel>Email</FieldLabel>
              <Input v-model="detailsForm.email" type="email" placeholder="you@example.com" required
                autocomplete="email" />
            </FieldGroup>
          </Field>
          <div class="flex flex-col gap-2">
            <Button type="submit" :disabled="detailsLoading">
              {{ detailsLoading ? "Saving..." : "Save" }}
            </Button>
            <p v-if="detailsError" class="text-sm text-destructive" role="alert">
              {{ detailsError }}
            </p>
            <p v-if="detailsSuccess" class="text-sm text-green-600" role="status">
              Profile updated successfully.
            </p>
          </div>
        </form>
      </section>

      <section>
        <Button as-child variant="outline" class="w-full">
          <NuxtLink to="/profile/password">Update password</NuxtLink>
        </Button>
      </section>
    </div>
  </main>
</template>
