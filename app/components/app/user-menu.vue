<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { user } = useUserSession();

function hashEmail(email: string): number {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

const profileIconIndex = computed(() => {
  const email = user.value?.email ?? "";
  if (!email) return 1;
  return (hashEmail(email) % 4) + 1;
});

</script>
<template>
  <AuthState v-slot="{ loggedIn, clear }">
    <template v-if="!loggedIn">
      <Button as-child variant="ghost">
        <NuxtLink to="/login">Login</NuxtLink>
      </Button>
      <Button as-child variant="default">
        <NuxtLink to="/signup">Sign up</NuxtLink>
      </Button>
    </template>
    <template v-else>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="secondary" class="cursor-pointer rounded-full size-10 p-0 overflow-hidden">
            <img :src="`/profile-icons/${profileIconIndex}.png`" alt="Profile"
              class="size-10/12 hover:size-11/12 transition-size duration-300" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem as-child>
              <NuxtLink to="/profile" class="cursor-pointer">Profile</NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <NuxtLink to="/associations/mine" class="cursor-pointer">My associations</NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <NuxtLink to="/" @click="clear" class="cursor-pointer">Logout</NuxtLink>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </template>
  </AuthState>
</template>