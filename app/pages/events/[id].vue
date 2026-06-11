<script setup lang="ts">
import { CalendarDays, MapPin, Users } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  type ApiEvent,
  EVENT_TYPE_LABELS,
  formatEventDate,
} from "@/lib/events";
import { extractErrorMessage } from "@/lib/utils";

interface EventDetail {
  event: ApiEvent;
  attendeeCount: number;
  attending: boolean;
}

const route = useRoute();
const eventId = route.params.id as string;

const { user } = useUserSession();
const membership = useMembership();

const requestFetch = useRequestFetch();
const { data, error: loadError } = await useAsyncData(`event-${eventId}`, () =>
  requestFetch<EventDetail>(`/api/events/${eventId}`),
);

if (loadError.value) {
  throw createError({ statusCode: 404, message: "Event not found" });
}

const event = computed(() => data.value?.event);
const attendeeCount = ref(data.value?.attendeeCount ?? 0);
const attending = ref(data.value?.attending ?? false);

const canRsvp = computed(
  () => Boolean(user.value) && membership.value?.status === "active",
);
const isPast = computed(() => {
  if (!event.value) return false;
  return new Date(event.value.endsAt ?? event.value.startsAt) < new Date();
});

const rsvping = ref(false);
const rsvpError = ref<string | null>(null);

async function toggleRsvp() {
  if (!user.value) return;
  rsvpError.value = null;
  rsvping.value = true;
  try {
    await $fetch(`/api/events/${eventId}/rsvp`, {
      method: attending.value ? "DELETE" : "POST",
    });
    attendeeCount.value += attending.value ? -1 : 1;
    attending.value = !attending.value;
  } catch (e: unknown) {
    rsvpError.value = extractErrorMessage(e);
  } finally {
    rsvping.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col px-4 pt-24 pb-16">
    <div v-if="event" class="mx-auto w-full max-w-3xl space-y-8">
      <div class="space-y-3">
        <p>
          <NuxtLink
            to="/"
            class="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            ← Back to events
          </NuxtLink>
        </p>
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ event.title }}
          </h1>
          <Badge variant="secondary" class="mt-2">
            {{ EVENT_TYPE_LABELS[event.type] }}
          </Badge>
          <Badge v-if="isPast" variant="outline" class="mt-2">Past</Badge>
        </div>
        <div class="space-y-1 text-muted-foreground">
          <p class="flex items-center gap-2">
            <CalendarDays class="size-4 shrink-0" aria-hidden="true" />
            <span>
              {{ formatEventDate(event.startsAt) }}
              <template v-if="event.endsAt">
                – {{ formatEventDate(event.endsAt) }}
              </template>
            </span>
          </p>
          <p v-if="event.location" class="flex items-center gap-2">
            <MapPin class="size-4 shrink-0" aria-hidden="true" />
            {{ event.location }}
          </p>
        </div>
      </div>

      <p v-if="event.description" class="whitespace-pre-line text-lg">
        {{ event.description }}
      </p>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0">
          <CardTitle class="flex items-center gap-2 text-base">
            <Users class="size-4 text-muted-foreground" aria-hidden="true" />
            {{ attendeeCount }} going
          </CardTitle>
          <Button
            v-if="canRsvp && !isPast"
            size="sm"
            :variant="attending ? 'outline' : 'default'"
            :disabled="rsvping"
            @click="toggleRsvp"
          >
            <template v-if="rsvping">Saving…</template>
            <template v-else-if="attending">Can't make it</template>
            <template v-else>I'm going</template>
          </Button>
        </CardHeader>
        <CardContent class="space-y-3">
          <p v-if="rsvpError" class="text-sm text-destructive" role="alert">
            {{ rsvpError }}
          </p>
          <p v-if="attendeeCount === 0" class="text-sm text-muted-foreground">
            No one has signed up yet.
          </p>
          <p
            v-if="!canRsvp && !isPast"
            class="text-sm text-muted-foreground"
          >
            <template v-if="!user">
              <NuxtLink
                to="/login"
                class="font-medium text-primary underline-offset-4 hover:underline"
              >
                Log in
              </NuxtLink>
              and join to RSVP to this event.
            </template>
            <template v-else-if="membership?.status === 'pending'">
              Your membership is pending approval — you'll be able to RSVP once
              you're approved.
            </template>
            <template v-else>
              Only members can RSVP to events.
            </template>
          </p>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
