<script setup lang="ts">
import { MapPin } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const { user } = useUserSession();

async function logout(clear: () => Promise<void>) {
  await clear();
  await navigateTo("/login");
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-foreground bg-background backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
        <MapPin class="size-6 text-red-600" aria-hidden="true" />
        <span class="text-foreground">Trail Association</span>
      </NuxtLink>

      <NavigationMenu class="hidden md:flex">
        <NavigationMenuList class="flex gap-1">
          <NavigationMenuItem>
            <NavigationMenuLink href="/">
              About
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink href="/">
              Associations
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="flex items-center gap-4">
        <AuthState v-slot="{ loggedIn, clear: clearSession }">
          <template v-if="!loggedIn">
            <Button as="NuxtLink" to="/login" variant="ghost">
              Login
            </Button>
            <Button as="NuxtLink" to="/signup" variant="default">
              Sign up
            </Button>
          </template>
          <template v-else>
            <span class="text-sm text-muted-foreground">{{ user?.email }}</span>
            <Button variant="ghost" @click="logout(clearSession)">
              Logout
            </Button>
          </template>
        </AuthState>
      </div>
    </div>
  </header>
</template>