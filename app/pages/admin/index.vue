<script setup lang="ts">
import { CalendarDays, MapPin, Users } from "@lucide/vue";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

definePageMeta({ middleware: "admin" });

const association = useAssociation();

type AdminStats = {
  activeCount: number;
  pendingCount: number;
  upcomingEventCount: number;
};

const requestFetch = useRequestFetch();
const { data, pending: loading, error } = await useAsyncData(
  "admin-stats",
  () =>
    requestFetch<AdminStats>(
      `/api/associations/${association.value?.id}/admin`,
    ),
);

const activeCount = computed(() => data.value?.activeCount ?? 0);
const pendingCount = computed(() => data.value?.pendingCount ?? 0);
const upcomingEventCount = computed(() => data.value?.upcomingEventCount ?? 0);
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
        Couldn't load admin data. Please try again.
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

        <Card>
          <CardHeader
            class="flex flex-row items-center justify-between space-y-0 pb-2"
          >
            <CardTitle class="text-sm font-medium">Events</CardTitle>
            <CalendarDays
              class="size-4 text-muted-foreground"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div class="flex items-end justify-between gap-4">
              <div>
                <p class="text-2xl font-bold">{{ upcomingEventCount }}</p>
                <p class="text-xs text-muted-foreground">upcoming events</p>
              </div>
              <Button as-child size="sm" variant="outline">
                <NuxtLink to="/admin/events">Manage</NuxtLink>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
</template>
