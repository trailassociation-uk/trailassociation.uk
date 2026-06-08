<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin } from "lucide-vue-next";

definePageMeta({ middleware: "auth" });

const association = useState<{
  id: string;
  name: string;
  region: string | null;
  description: string | null;
} | null>("association");
const membership = useState<{ status: string; role: string } | null>(
  "association-membership",
);

const activeCount = ref(0);
const pendingCount = ref(0);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  if (!association.value) return navigateTo("/");
  if (membership.value?.role !== "admin") return navigateTo("/");

  try {
    const data = await $fetch<{ activeCount: number; pendingCount: number }>(
      `/api/associations/${association.value.id}/admin`,
    );
    activeCount.value = data.activeCount;
    pendingCount.value = data.pendingCount;
  } catch {
    error.value = "Couldn't load admin data. Please try again.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p class="mt-2 text-muted-foreground">
          Manage {{ association?.name }}.
        </p>
      </div>

      <div v-if="loading" class="text-muted-foreground">Loading...</div>

      <p v-else-if="error" class="text-sm text-destructive" role="alert">
        {{ error }}
      </p>

      <div v-else class="space-y-6">
        <Card>
          <CardContent class="pt-6">
            <div class="flex items-end justify-between">
              <div class="space-y-4">
                <div class="flex flex-wrap items-center gap-2">
                  <p class="font-semibold">{{ association?.name }}</p>
                  <Badge
                    v-if="association?.region"
                    variant="secondary"
                    class="flex items-center gap-1"
                  >
                    <MapPin class="size-3" aria-hidden="true" />
                    {{ association.region }}
                  </Badge>
                </div>
                <p
                  v-if="association?.description"
                  class="text-sm text-muted-foreground"
                >
                  {{ association.description }}
                </p>
              </div>
              <Button as-child size="sm" variant="outline" class="shrink-0">
                <NuxtLink to="/admin/details">Edit</NuxtLink>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Members</CardTitle>
            <Users class="size-4 text-muted-foreground" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-2xl font-bold">{{ activeCount }}</p>
                <p class="text-xs text-muted-foreground">
                  <span v-if="pendingCount > 0">
                    {{ pendingCount }} pending approval
                  </span>
                  <span v-else>active members</span>
                </p>
              </div>
              <Button as-child size="sm" variant="outline">
                <NuxtLink to="/admin/members">Manage</NuxtLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
