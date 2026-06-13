<script setup lang="ts">
import ErrorPage from "@/components/app/error-page.vue";

const route = useRoute();
const statusCode = computed(() => Number(route.query.status) || 404);
</script>

<template>
  <ErrorPage :status-code="statusCode" />
</template>
