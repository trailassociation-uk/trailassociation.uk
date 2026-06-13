<script setup lang="ts">
import { Button } from "@/components/ui/button";

const props = defineProps<{
  statusCode: number;
  statusMessage?: string;
}>();

type ErrorContent = { code: string; headline: string; body: string };

const content = computed((): ErrorContent => {
  if (props.statusCode === 404) {
    return {
      code: "404",
      headline: "Off piste",
      body: "The page you're looking for doesn't exist.",
    };
  }
  if (props.statusCode === 500) {
    return {
      code: "500",
      headline: "Over the bars",
      body: "Something went wrong on our end. We're working on it.",
    };
  }
  return {
    code: String(props.statusCode),
    headline: "Trail closed",
    body: props.statusMessage || "Something unexpected happened.",
  };
});
</script>

<template>
  <main
    class="relative flex flex-1 flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 pt-16"
    :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1615406308854-4805ac35ef25?q=80)' }"
  >
    <div class="absolute inset-0 bg-foreground/60" aria-hidden="true" />
    <div class="relative z-10 mx-auto max-w-2xl text-center text-background">
      <p class="select-none text-9xl font-bold tracking-tight opacity-60">
        {{ content.code }}
      </p>
      <h1 class="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        {{ content.headline }}
      </h1>
      <p class="mt-6 text-lg text-background/80 sm:text-xl">
        {{ content.body }}
      </p>
      <div class="mt-10">
        <Button as="a" href="/" size="lg" variant="secondary">
          Back to the trailhead
        </Button>
      </div>
    </div>
  </main>
</template>
