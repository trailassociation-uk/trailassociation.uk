<script setup lang="ts">
import EventForm, {
  type EventFormValues,
} from "@/components/app/event-form.vue";
import {
  type ApiEvent,
  fromDatetimeLocal,
  toDatetimeLocal,
} from "@/lib/events";
import { extractErrorMessage } from "@/lib/utils";

definePageMeta({ middleware: "admin" });

const route = useRoute();
const eventId = route.params.id as string;

const requestFetch = useRequestFetch();
const { data, pending: loading, error: loadError } = await useAsyncData(
  `admin-event-${eventId}`,
  () => requestFetch<{ event: ApiEvent }>(`/api/events/${eventId}`),
);

const initial = computed<EventFormValues | undefined>(() => {
  const event = data.value?.event;
  if (!event) return undefined;
  return {
    type: event.type,
    title: event.title,
    description: event.description ?? "",
    startsAt: toDatetimeLocal(event.startsAt),
    endsAt: event.endsAt ? toDatetimeLocal(event.endsAt) : "",
    location: event.location ?? "",
  };
});

const saving = ref(false);
const error = ref<string | null>(null);

async function save(values: EventFormValues) {
  error.value = null;
  saving.value = true;
  try {
    await $fetch(`/api/events/${eventId}`, {
      method: "PATCH",
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
        <h1 class="text-2xl font-bold tracking-tight">Edit event</h1>
        <p class="mt-2 text-muted-foreground">
          <NuxtLink to="/admin/events" class="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to events
          </NuxtLink>
        </p>
      </div>

      <div v-if="loading" class="text-muted-foreground">Loading...</div>

      <p v-else-if="loadError" class="text-sm text-destructive" role="alert">
        Couldn't load this event. Please try again.
      </p>

      <EventForm
        v-else-if="initial"
        :initial="initial"
        submit-label="Save"
        saving-label="Saving…"
        :saving="saving"
        :error="error"
        @submit="save"
      />
    </div>
  </main>
</template>
