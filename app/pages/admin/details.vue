<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { extractErrorMessage } from "@/lib/utils";

definePageMeta({ middleware: "auth" });

const association = useState<{ id: string; name: string; region: string | null; description: string | null } | null>("association");
const membership = useState<{ status: string; role: string } | null>("association-membership");

const detailsForm = reactive({ name: "", region: "", description: "" });
const detailsSaving = ref(false);
const detailsError = ref<string | null>(null);
const detailsSuccess = ref(false);

onMounted(() => {
  if (!association.value) return navigateTo("/");
  if (membership.value?.role !== "admin") return navigateTo("/");

  detailsForm.name = association.value.name;
  detailsForm.region = association.value.region ?? "";
  detailsForm.description = association.value.description ?? "";
});

async function saveDetails() {
  detailsError.value = null;
  detailsSuccess.value = false;
  detailsSaving.value = true;
  try {
    await $fetch("/api/association", {
      method: "PATCH",
      body: {
        name: detailsForm.name,
        region: detailsForm.region,
        description: detailsForm.description,
      },
    });
    if (association.value) {
      association.value = {
        ...association.value,
        name: detailsForm.name,
        region: detailsForm.region || null,
        description: detailsForm.description || null,
      };
    }
    detailsSuccess.value = true;
  } catch (e: unknown) {
    detailsError.value = extractErrorMessage(e);
  } finally {
    detailsSaving.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Association details</h1>
        <p class="mt-2 text-muted-foreground">
          <NuxtLink to="/admin" class="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to admin
          </NuxtLink>
        </p>
      </div>

      <form class="space-y-4" @submit.prevent="saveDetails">
        <Field>
          <FieldGroup>
            <FieldLabel>Name</FieldLabel>
            <Input v-model="detailsForm.name" type="text" placeholder="Association name" required />
          </FieldGroup>
        </Field>
        <Field>
          <FieldGroup>
            <FieldLabel>Region</FieldLabel>
            <Input v-model="detailsForm.region" type="text" placeholder="e.g. Yorkshire" />
          </FieldGroup>
        </Field>
        <Field>
          <FieldGroup>
            <FieldLabel>Description</FieldLabel>
            <Textarea
              v-model="detailsForm.description"
              placeholder="A short description of your association…"
              rows="4"
            />
          </FieldGroup>
        </Field>
        <div class="flex flex-col gap-2">
          <Button type="submit" :disabled="detailsSaving">
            {{ detailsSaving ? "Saving…" : "Save" }}
          </Button>
          <p v-if="detailsError" class="text-sm text-destructive" role="alert">
            {{ detailsError }}
          </p>
          <p v-if="detailsSuccess" class="text-sm text-green-600" role="status">
            Details updated.
          </p>
        </div>
      </form>
    </div>
  </main>
</template>
