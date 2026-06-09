<script setup lang="ts">
import { CalendarDays, MapPin } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
}

const props = defineProps<Props>();

const { user } = useUserSession();

type MembershipState = { status: string; role: string } | null;

const membership = useState<MembershipState>(
  "association-membership",
  () => null,
);

const joining = ref(false);

async function requestToJoin() {
  joining.value = true;
  try {
    await $fetch(`/api/associations/${props.id}/join`, { method: "POST" });
    membership.value = { status: "pending", role: "member" };
  } finally {
    joining.value = false;
  }
}
</script>

<template>
  <main class="flex flex-1 flex-col px-4 pt-24 pb-16">
    <div class="mx-auto w-full max-w-3xl space-y-8">
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="flex flex-wrap items-center gap-2 flex-1 min-w-0">
            <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
              {{ props.name }}
            </h1>
            <Badge
              v-if="props.region"
              variant="secondary"
              class="flex items-center mt-2 gap-1"
            >
              <MapPin class="size-3" aria-hidden="true" />
              {{ props.region }}
            </Badge>
          </div>
          <Button
            v-if="user && membership?.role === 'admin'"
            as-child
            class="shrink-0"
            size="sm"
          >
            <NuxtLink to="/admin">Manage</NuxtLink>
          </Button>
          <Button
            v-else-if="user && membership === null"
            class="shrink-0"
            size="sm"
            :disabled="joining"
            @click="requestToJoin"
          >
            {{ joining ? "Requesting…" : "Request to join" }}
          </Button>
          <Badge
            v-else-if="user && membership?.status === 'pending'"
            variant="outline"
            class="shrink-0"
          >
            Request pending
          </Badge>
          <Badge
            v-else-if="user && membership?.role === 'member' && membership?.status === 'active'"
            variant="secondary"
            class="shrink-0"
          >
            Member
          </Badge>
        </div>
        <p v-if="props.description" class="text-lg text-muted-foreground">
          {{ props.description }}
        </p>
      </div>

      <hr class="border-border" />

      <section aria-labelledby="events-heading">
        <div class="mb-4 flex items-center gap-2">
          <CalendarDays
            class="size-5 text-muted-foreground"
            aria-hidden="true"
          />
          <h2 id="events-heading" class="text-xl font-semibold">
            Upcoming events
          </h2>
        </div>

        <Card>
          <CardHeader>
            <CardTitle class="text-base">No upcoming events</CardTitle>
            <CardDescription>
              Check back later for rides, trail days, and other events from
              {{ props.name }}.
            </CardDescription>
          </CardHeader>
          <CardContent />
        </Card>
      </section>
    </div>
  </main>
</template>
