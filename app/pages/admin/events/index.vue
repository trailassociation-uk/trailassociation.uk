<script setup lang="ts">
import { CalendarDays, MapPin } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  type ApiEvent,
  EVENT_TYPE_LABELS,
  formatEventDate,
} from "@/lib/events";

definePageMeta({ middleware: "admin" });

const requestFetch = useRequestFetch();
const { data, pending: loading, error } = await useAsyncData(
  "admin-events",
  () => requestFetch<{ events: ApiEvent[] }>("/api/events?all"),
);

const events = ref<ApiEvent[]>(data.value?.events ?? []);

const deleting = ref<string | null>(null);

async function remove(event: ApiEvent) {
  if (!window.confirm(`Delete "${event.title}"? This cannot be undone.`)) {
    return;
  }
  deleting.value = event.id;
  try {
    await $fetch(`/api/events/${event.id}`, { method: "DELETE" });
    events.value = events.value.filter((e) => e.id !== event.id);
  } finally {
    deleting.value = null;
  }
}

function isPast(event: ApiEvent) {
  return new Date(event.endsAt ?? event.startsAt) < new Date();
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div class="flex items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">Events</h1>
          <p class="mt-2 text-muted-foreground">
            <NuxtLink to="/admin" class="font-medium text-primary underline-offset-4 hover:underline">
              ← Back to admin
            </NuxtLink>
          </p>
        </div>
        <Button as-child size="sm" class="shrink-0">
          <NuxtLink to="/admin/events/new">New event</NuxtLink>
        </Button>
      </div>

      <div v-if="loading" class="text-muted-foreground">Loading...</div>

      <p v-else-if="error" class="text-sm text-destructive" role="alert">
        Couldn't load events. Please try again.
      </p>

      <div
        v-else-if="events.length === 0"
        class="rounded-lg border border-foreground p-8 text-center"
      >
        <p class="text-muted-foreground">
          No events yet. Create your first one.
        </p>
      </div>

      <ul v-else class="space-y-2">
        <li
          v-for="event in events"
          :key="event.id"
          class="flex items-center justify-between gap-4 rounded-lg border border-foreground p-4"
          :class="{ 'opacity-60': isPast(event) }"
        >
          <div class="min-w-0 space-y-1">
            <div class="flex flex-wrap items-center gap-2">
              <p class="truncate font-semibold">{{ event.title }}</p>
              <Badge variant="secondary">{{ EVENT_TYPE_LABELS[event.type] }}</Badge>
              <Badge v-if="isPast(event)" variant="outline">Past</Badge>
            </div>
            <p class="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays class="size-3.5 shrink-0" aria-hidden="true" />
              {{ formatEventDate(event.startsAt) }}
            </p>
            <p
              v-if="event.location"
              class="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin class="size-3.5 shrink-0" aria-hidden="true" />
              <span class="truncate">{{ event.location }}</span>
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <Button as-child size="sm" variant="outline">
              <NuxtLink :to="`/admin/events/${event.id}`">Edit</NuxtLink>
            </Button>
            <Button
              size="sm"
              variant="outline"
              :disabled="deleting === event.id"
              @click="remove(event)"
            >
              {{ deleting === event.id ? "Deleting…" : "Delete" }}
            </Button>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>
