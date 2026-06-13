<script setup lang="ts">
import { refDebounced } from "@vueuse/core";
import { Input } from "@/components/ui/input";

interface DirectoryAssociation {
  id: string;
  name: string;
  slug: string;
  region: string | null;
  description: string | null;
  url: string;
}

const regionFilter = ref("");
const debouncedRegion = refDebounced(regionFilter, 300);

const requestFetch = useRequestFetch();
const { data, pending, error } = await useAsyncData(
  "associations-directory",
  () =>
    requestFetch<{ associations: DirectoryAssociation[] }>("/api/associations", {
      query: debouncedRegion.value ? { region: debouncedRegion.value } : {},
    }),
  { watch: [debouncedRegion], dedupe: "defer", keepPreviousData: true },
);

const associations = computed(() => data.value?.associations ?? []);
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Associations</h1>
        <p class="mt-2 text-muted-foreground">
          Trail associations across the UK.
        </p>
      </div>

      <Input
        v-model="regionFilter"
        placeholder="Filter by region..."
        class="max-w-xs"
      />

      <p v-if="error" class="text-sm text-destructive" role="alert">
        Couldn't load associations. Please try again.
      </p>

      <div
        v-else-if="!pending && associations.length === 0"
        class="rounded-lg border border-foreground p-8 text-center"
      >
        <p class="text-muted-foreground">
          {{ regionFilter ? "No associations found for that region." : "No associations yet." }}
        </p>
      </div>

      <ul v-else-if="associations.length > 0" class="space-y-3">
        <li v-for="association in associations" :key="association.id">
          <a
            :href="association.url"
            class="flex items-center justify-between gap-4 rounded-lg border border-foreground p-4 transition-colors hover:bg-muted"
          >
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ association.name }}</p>
              <p v-if="association.description" class="mt-0.5 truncate text-sm text-muted-foreground">
                {{ association.description }}
              </p>
            </div>
            <span
              v-if="association.region"
              class="shrink-0 rounded-full border border-foreground px-2 py-0.5 text-xs text-muted-foreground"
            >
              {{ association.region }}
            </span>
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>
