<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
</script>


<template>
    <header class="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex items-center gap-2 font-semibold">
          <MapPin class="size-6 text-red-600" aria-hidden="true" />
          <span class="text-white">Trail Association</span>
        </NuxtLink>

        <NavigationMenu class="hidden md:flex">
          <NavigationMenuList class="flex gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink href="/about" >
                About
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="/associations" >
                Associations
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div class="flex items-center gap-4">
          <Button as="a" href="/login" variant="ghost">
            Login
          </Button>
        </div>
      </div>
    </header>
</template>