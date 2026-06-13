<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>

<template>
  <main
    class="relative flex flex-1 flex-col items-center justify-center bg-cover bg-center bg-no-repeat px-4 pt-16"
    :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1615406308854-4805ac35ef25?q=80)' }"
  >
    <div class="absolute inset-0 bg-foreground/50" aria-hidden="true" />
    <div class="relative z-10 mx-auto max-w-3xl text-center text-background">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Riders unite, trails thrive!
      </h1>
      <p class="mt-6 text-lg sm:text-xl">
        Whether you're forming a new association or boosting your existing
        crew, we're your sidekick every step of the way.
      </p>
      <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Button as="a" href="/associations" size="lg" variant="default">
          Find trails
        </Button>
        <Button as="a" href="/" size="lg" variant="secondary">
          No dig, no ride
        </Button>
      </div>
    </div>
  </main>
</template>
