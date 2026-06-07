<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, CalendarDays } from "lucide-vue-next";

interface Props {
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
}

const props = defineProps<Props>();
</script>

<template>
  <main class="flex flex-1 flex-col px-4 pt-24 pb-16">
    <div class="mx-auto w-full max-w-3xl space-y-8">
      <div class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ props.name }}
          </h1>
          <Badge v-if="props.region" variant="secondary" class="flex items-center gap-1">
            <MapPin class="size-3" aria-hidden="true" />
            {{ props.region }}
          </Badge>
        </div>
        <p v-if="props.description" class="text-lg text-muted-foreground">
          {{ props.description }}
        </p>
      </div>

      <hr class="border-border" />

      <section aria-labelledby="events-heading">
        <div class="mb-4 flex items-center gap-2">
          <CalendarDays class="size-5 text-muted-foreground" aria-hidden="true" />
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
