<script setup lang="ts">
import AssociationHome from "@/components/app/association-home.vue";
import Home from "@/components/app/home.vue";

interface AssociationPublic {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
}

const association = useState<AssociationPublic | null>("association");
</script>

<template>
  <AssociationHome v-if="association" v-bind="association" />
  <Home v-else />
</template>
