<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; statusMessage: string } }>();
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
    <h1 class="text-6xl font-bold">{{ props.error.statusCode }}</h1>
    <p class="text-muted-foreground">
      {{ props.error.statusCode === 404 ? "Page not found." : "Something went wrong." }}
    </p>
    <NuxtLink to="/" class="text-primary underline-offset-4 hover:underline">
      Go home
    </NuxtLink>
  </div>
</template>
