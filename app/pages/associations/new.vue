<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractErrorMessage, slugify } from "@/lib/utils";

definePageMeta({
  middleware: [
    (to) => {
      const { user } = useUserSession();
      if (!user.value) {
        return navigateTo(`/signup?next=${encodeURIComponent(to.fullPath)}`, { replace: true });
      }
    },
  ],
});

const { public: { host: appHost } } = useRuntimeConfig();

const form = reactive({
  name: "",
  subdomain: "",
  region: "",
  description: "",
});

const error = ref<string | null>(null);
const loading = ref(false);
// Tracks whether the user has manually edited the subdomain so we stop
// auto-deriving it from the name once they take control.
const subdomainTouched = ref(false);

watch(
  () => form.name,
  (name) => {
    if (!subdomainTouched.value) {
      form.subdomain = slugify(name);
    }
  }
);

function onSubdomainInput() {
  // Stop deriving the subdomain from the name once the user edits it directly.
  // We deliberately don't rewrite the value here: mutating it on every
  // keystroke snaps the caret to the end and breaks select-and-delete.
  // Normalisation happens on blur (and again on submit) instead.
  subdomainTouched.value = true;
}

function normalizeSubdomainField() {
  form.subdomain = slugify(form.subdomain);
}


async function onSubmit() {
  // Guard against double submits (rapid clicks / Enter) before the disabled
  // state has rendered.
  if (loading.value) return;
  error.value = null;
  loading.value = true;
  // Normalise once more in case the field wasn't blurred before submitting.
  normalizeSubdomainField();
  try {
    const { url } = await $fetch("/api/associations", {
      method: "POST",
      body: {
        name: form.name,
        subdomain: form.subdomain,
        region: form.region || undefined,
        description: form.description || undefined,
      },
    });
    // The new association lives on its own subdomain, so do a full external
    // navigation rather than client-side routing.
    await navigateTo(url, { external: true });
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
        <h1 class="text-2xl font-bold tracking-tight">Create an association</h1>
        <p class="mt-2 text-muted-foreground">
          Start a new trail association and invite your crew.
        </p>
      </div>

      <form class="space-y-6" @submit.prevent="onSubmit">
        <Field>
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input v-model="form.name" type="text" placeholder="Peak District Trail Association" required
              maxlength="100" autocomplete="organization" />
          </FieldGroup>
        </Field>

        <Field>
          <FieldGroup>
            <FieldLabel>Subdomain</FieldLabel>
            <div class="flex items-center gap-1">
              <Input v-model="form.subdomain" type="text" placeholder="peak-district" required minlength="3"
                maxlength="63" autocapitalize="none" autocomplete="off" spellcheck="false" class="text-right"
                @input="onSubdomainInput" @blur="normalizeSubdomainField" />
              <span class="text-muted-foreground whitespace-nowrap">.{{ appHost }}</span>
            </div>
            <FieldDescription>
              Lowercase letters, numbers, and hyphens. This becomes your
              association's web address.
            </FieldDescription>
          </FieldGroup>
        </Field>

        <Field>
          <FieldGroup>
            <FieldLabel>
              Region
              <span class="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Input v-model="form.region" type="text" placeholder="Peak District" maxlength="100" />
          </FieldGroup>
        </Field>

        <Field>
          <FieldGroup>
            <FieldLabel>
              Description
              <span class="text-muted-foreground font-normal">(optional)</span>
            </FieldLabel>
            <Textarea v-model="form.description" placeholder="Tell riders what your association is about…"
              maxlength="1000" rows="4" />
          </FieldGroup>
        </Field>

        <Button type="submit" class="w-full" :disabled="loading">
          {{ loading ? "Creating..." : "Create association" }}
        </Button>

        <p v-if="error" class="text-sm text-destructive" role="alert">
          {{ error }}
        </p>
      </form>
    </div>
  </main>
</template>
