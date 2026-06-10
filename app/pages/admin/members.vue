<script setup lang="ts">
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

definePageMeta({ middleware: "auth" });

interface Member {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  role: "admin" | "member";
  status: "active" | "pending";
  createdAt: string;
}

const association = useAssociation();
const membership = useMembership();
const { user } = useUserSession();

const actioning = ref<string | null>(null);

const { data, pending: loading, error } = await useAsyncData(
  "admin-members",
  async (): Promise<{ members: Member[] } | null> => {
    if (!association.value || membership.value?.role !== "admin") {
      await navigateTo("/");
      return null;
    }
    return $fetch(`/api/associations/${association.value.id}/members`);
  },
);

const members = ref<Member[]>(data.value?.members ?? []);

const pendingMembers = computed(() => members.value.filter((m) => m.status === "pending"));
const activeMembers = computed(() => members.value.filter((m) => m.status === "active"));

async function approve(member: Member) {
  actioning.value = member.userId;
  try {
    await $fetch(`/api/associations/${association.value?.id}/members/${member.userId}`, {
      method: "PATCH",
      body: { status: "active" },
    });
    const target = members.value.find((m) => m.userId === member.userId);
    if (target) target.status = "active";
  } finally {
    actioning.value = null;
  }
}

async function remove(member: Member) {
  actioning.value = member.userId;
  try {
    await $fetch(`/api/associations/${association.value?.id}/members/${member.userId}`, {
      method: "DELETE",
    });
    members.value = members.value.filter((m) => m.userId !== member.userId);
  } finally {
    actioning.value = null;
  }
}

function displayName(member: Member) {
  return member.name ?? member.email;
}
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pt-24 pb-16">
    <div class="w-full max-w-2xl space-y-8">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Members</h1>
        <p class="mt-2 text-muted-foreground">
          <NuxtLink to="/admin" class="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to admin
          </NuxtLink>
        </p>
      </div>

      <div v-if="loading" class="text-muted-foreground">Loading...</div>

      <p v-else-if="error" class="text-sm text-destructive" role="alert">
        Couldn't load members. Please try again.
      </p>

      <template v-else>
        <section v-if="pendingMembers.length > 0" class="space-y-3">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Pending ({{ pendingMembers.length }})
          </h2>
          <ul class="space-y-2">
            <li
              v-for="member in pendingMembers"
              :key="member.userId"
              class="flex items-center justify-between gap-4 rounded-lg border border-foreground p-4"
            >
              <div class="min-w-0">
                <p class="truncate font-semibold">{{ displayName(member) }}</p>
                <p v-if="member.name" class="truncate text-sm text-muted-foreground">
                  {{ member.email }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <Button
                  size="sm"
                  :disabled="actioning === member.userId"
                  @click="approve(member)"
                >
                  {{ actioning === member.userId ? "Approving…" : "Approve" }}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  :disabled="actioning === member.userId"
                  @click="remove(member)"
                >
                  Remove
                </Button>
              </div>
            </li>
          </ul>
        </section>

        <section class="space-y-3">
          <h2 class="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Active ({{ activeMembers.length }})
          </h2>

          <div
            v-if="activeMembers.length === 0"
            class="rounded-lg border border-foreground p-8 text-center"
          >
            <p class="text-muted-foreground">No active members yet.</p>
          </div>

          <ul v-else class="space-y-2">
            <li
              v-for="member in activeMembers"
              :key="member.userId"
              class="flex items-center justify-between gap-4 rounded-lg border border-foreground p-4"
            >
              <div class="min-w-0">
                <p class="truncate font-semibold">{{ displayName(member) }}</p>
                <p v-if="member.name" class="truncate text-sm text-muted-foreground">
                  {{ member.email }}
                </p>
              </div>
              <div class="flex shrink-0 items-center gap-2">
                <Badge variant="secondary" class="capitalize">{{ member.role }}</Badge>
                <Button
                  v-if="member.userId !== user?.id"
                  size="sm"
                  variant="outline"
                  :disabled="actioning === member.userId"
                  @click="remove(member)"
                >
                  {{ actioning === member.userId ? "Removing…" : "Remove" }}
                </Button>
              </div>
            </li>
          </ul>
        </section>
      </template>
    </div>
  </main>
</template>
