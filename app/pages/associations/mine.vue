<script setup lang="ts">
import { Button } from "@/components/ui/button";

interface MyAssociation {
  id: string;
  name: string;
  subdomain: string;
  role: "admin" | "member";
  status: "active" | "pending";
  url: string;
}

const { user } = useUserSession();

const associations = ref<MyAssociation[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

async function fetchAssociations() {
  loading.value = true;
  error.value = null;
  try {
    const { associations: rows } =
      await $fetch<{ associations: MyAssociation[] }>("/api/associations/mine");
    associations.value = rows;
  } catch {
    error.value = "Couldn't load your associations. Please try again.";
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!user.value) {
    await navigateTo("/login", { replace: true });
    return;
  }
  await fetchAssociations();
});

watch(user, (u) => {
  if (!u && !loading.value) {
    navigateTo("/login", { replace: true });
  }
});
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold tracking-tight">My associations</h1>
          <p class="mt-2 text-muted-foreground">
            Trail associations you're a part of.
          </p>
        </div>
        <Button as-child variant="default">
          <NuxtLink to="/associations/new">Create</NuxtLink>
        </Button>
      </div>

      <div v-if="loading" class="text-muted-foreground">
        Loading...
      </div>

      <p v-else-if="error" class="text-sm text-destructive" role="alert">
        {{ error }}
      </p>

      <div v-else-if="associations.length === 0" class="rounded-lg border border-foreground p-8 text-center">
        <p class="text-muted-foreground">
          You're not part of any associations yet.
        </p>
        <Button as-child variant="default" class="mt-4">
          <NuxtLink to="/associations/new">Create your first association</NuxtLink>
        </Button>
      </div>

      <ul v-else class="space-y-3">
        <li v-for="association in associations" :key="association.id">
          <a :href="association.url"
            class="flex items-center justify-between gap-4 rounded-lg border border-foreground p-4 transition-colors hover:bg-muted">
            <div class="min-w-0">
              <p class="truncate font-semibold">{{ association.name }}</p>
              <p class="truncate text-sm text-muted-foreground">
                {{ association.subdomain }}.trailassociation.uk
              </p>
            </div>
            <div class="flex shrink-0 items-center gap-2 text-xs">
              <span v-if="association.status === 'pending'"
                class="rounded-full border border-foreground px-2 py-0.5 text-muted-foreground">
                Pending
              </span>
              <span class="rounded-full bg-foreground px-2 py-0.5 capitalize text-background">
                {{ association.role }}
              </span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </main>
</template>
