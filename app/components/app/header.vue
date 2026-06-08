<script setup lang="ts">
import { MapPin } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import UserMenu from "@/components/app/user-menu.vue";

const association = useState<{ name: string } | null>("association");
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 border-b border-foreground bg-background backdrop-blur">
    <div class="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
      <div class="flex flex-1 items-center">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <MapPin class="size-6 text-red-600" aria-hidden="true" />
          <span class="text-foreground">{{ association?.name ?? "Trail Association" }}</span>
        </NuxtLink>
      </div>

      <NavigationMenu class="hidden md:flex">
        <NavigationMenuList class="flex gap-1">
          <template v-if="association">
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Events</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Members</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">About</NavigationMenuLink>
            </NavigationMenuItem>
          </template>
          <template v-else>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">About</NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/">Associations</NavigationMenuLink>
            </NavigationMenuItem>
          </template>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="flex flex-1 items-center justify-end gap-4">
        <UserMenu />
      </div>
    </div>
  </header>
</template>