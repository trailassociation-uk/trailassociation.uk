<script setup lang="ts">
import { CalendarDays, Globe, MapPin, Users } from "@lucide/vue";
import { Button } from "@/components/ui/button";

const { loggedIn } = useUserSession();

const features = [
  {
    icon: Globe,
    title: "Your own site",
    description:
      "Every association gets its very own '.trailassociation.uk' site to share with riders.",
  },
  {
    icon: CalendarDays,
    title: "Dig days and rides",
    description:
      "Keep your events in one place, from trail days and group rides to committee meetings.",
  },
  {
    icon: Users,
    title: "Members, sorted",
    description:
      "Riders ask to join and you approve them, so you always know who's actually on the books.",
  },
];
</script>

<template>
  <main class="flex flex-1 flex-col">
    <section class="border-b border-foreground px-4 pt-28 pb-20 sm:px-6 sm:pt-36 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <span
          class="inline-flex items-center gap-2 rounded-full border border-foreground px-3 py-1 text-sm font-medium"
        >
          <MapPin class="size-4 text-red-600" aria-hidden="true" />
          For UK trail associations
        </span>
        <h1 class="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
          Give your trail association a home online.
        </h1>
        <p class="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground text-balance sm:text-xl">
          Set up a page for your group, post your dig days and rides, and keep
          your members in one place.
        </p>
        <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as-child size="lg">
            <NuxtLink to="/associations/new">Create an association</NuxtLink>
          </Button>
          <Button as-child size="lg" variant="outline">
            <NuxtLink to="/associations">Browse the directory</NuxtLink>
          </Button>
        </div>
      </div>
    </section>

    <section class="px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-center text-2xl font-bold tracking-tight sm:text-3xl">
          What you get
        </h2>
        <div class="mt-12 grid gap-6 sm:grid-cols-3">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="rounded-lg border border-foreground p-6"
          >
            <component :is="feature.icon" class="size-6" aria-hidden="true" />
            <h3 class="mt-4 font-semibold">{{ feature.title }}</h3>
            <p class="mt-2 text-sm text-muted-foreground">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="border-t border-foreground px-4 py-20 sm:px-6 lg:px-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          Ready when you are
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-muted-foreground">
          Wether starting something new or moving an established group across, you can
          be set up in a few minutes. Associations show up in the directory,
          so local riders can find you.
        </p>
        <div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button as-child size="lg">
            <NuxtLink to="/associations/new">Create an association</NuxtLink>
          </Button>
          <Button as-child size="lg" variant="outline">
            <NuxtLink to="/associations">Browse the directory</NuxtLink>
          </Button>
        </div>
      </div>
    </section>
  </main>
</template>
