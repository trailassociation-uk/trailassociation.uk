<script setup lang="ts">
import Footer from "@/components/app/footer.vue";
import Header from "@/components/app/header.vue";
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <Header />
    <NuxtPage />
    <Footer />
  </div>
</template>
