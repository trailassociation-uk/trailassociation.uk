<script setup lang="ts">
import ErrorPage from "@/components/app/error-page.vue";
import Footer from "@/components/app/footer.vue";
import Header from "@/components/app/header.vue";

const props = defineProps<{
  error: { statusCode: number; statusMessage: string };
}>();
</script>

<template>
  <div class="flex min-h-screen flex-col bg-background text-foreground">
    <Header />
    <ErrorPage :status-code="props.error.statusCode" :status-message="props.error.statusMessage" />
    <Footer />
  </div>
</template>
