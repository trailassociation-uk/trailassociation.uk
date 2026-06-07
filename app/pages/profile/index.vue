<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

definePageMeta({ middleware: "auth" });

const { fetch: refreshSession } = useUserSession();

const profile = ref<{ id: number; email: string; name: string } | null>(null);
const profileLoading = ref(true);

const detailsForm = reactive({
  name: "",
  email: "",
});
const detailsError = ref<string | null>(null);
const detailsLoading = ref(false);
const detailsSuccess = ref(false);

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
    detailsForm.email = profile.value?.email ?? "";
    detailsForm.name = profile.value?.name ?? "";
  } catch {
    profile.value = null;
  } finally {
    profileLoading.value = false;
  }
}

async function onDetailsSubmit() {
  detailsError.value = null;
  detailsSuccess.value = false;
  detailsLoading.value = true;
  try {
    if (detailsForm.name !== profile.value?.name) {
      await $fetch("/api/profile/name", {
        method: "PATCH",
        body: { name: detailsForm.name },
      });
    }
    if (detailsForm.email !== profile.value?.email) {
      await $fetch("/api/profile/email", {
        method: "PATCH",
        body: { email: detailsForm.email },
      });
    }
    await refreshSession();
    await fetchProfile();
    detailsSuccess.value = true;
  } catch (e: unknown) {
    detailsError.value = extractErrorMessage(e);
  } finally {
    detailsLoading.value = false;
  }
}

onMounted(() => { fetchProfile(); });
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
