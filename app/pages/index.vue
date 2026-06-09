<script setup lang="ts">
import AssociationHome from "@/components/app/association-home.vue";
import Home from "@/components/app/home.vue";

const association = useAssociation();
</script>

<template>
  <AssociationHome v-if="association" v-bind="association" />
  <Home v-else />
</template>
