<script setup lang="ts">
import EventForm, {
  type EventFormValues,
} from "@/components/app/event-form.vue";
import { fromDatetimeLocal } from "@/lib/events";
import { extractErrorMessage } from "@/lib/utils";

definePageMeta({ middleware: "admin" });

const saving = ref(false);
const error = ref<string | null>(null);

async function create(values: EventFormValues) {
  error.value = null;
  saving.value = true;
  try {
    await $fetch("/api/events", {
      method: "POST",
      body: {
        type: values.type,
        title: values.title,
        description: values.description,
        startsAt: fromDatetimeLocal(values.startsAt),
        endsAt: fromDatetimeLocal(values.endsAt),
        location: values.location,
      },
    });
    await navigateTo("/admin/events");
  } catch (e: unknown) {
    error.value = extractErrorMessage(e);
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">New event</h1>
        <p class="mt-2 text-muted-foreground">
          <NuxtLink to="/admin/events" class="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to events
          </NuxtLink>
        </p>
      </div>

      <EventForm
        submit-label="Create event"
        saving-label="Creating…"
        :saving="saving"
        :error="error"
        @submit="create"
      />
    </div>
  </main>
</template>
