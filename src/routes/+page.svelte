<script>
  import { HeroHeader } from "flowbite-svelte-blocks";
  import { Button } from "flowbite-svelte";
</script>

<div
  class="h-screen bg-[url('https://images.unsplash.com/photo-1594032362338-04b9952eb440?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&h=1800&q=80&crop=bottom')] bg-cover p-12 md:p-36"
>
  <HeroHeader
    h1Class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white"
    pClass="max-w-2xl mb-6 w-4/5 md:w-full font-light text-gray-300 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
  >
    <svelte:fragment slot="h1">Riders unite, trails thrive!</svelte:fragment>
    <svelte:fragment slot="paragraph">
      Whether you're forming a new association or boosting your existing crew, we're your sidekick
      every step of the way.
    </svelte:fragment>
    <a href="/signup"
      ><Button size="xl" color="red" class="mr-3 inline-flex items-center justify-center"
        >Get started</Button
      >
    </a>
    <a href="/about"
      ><Button size="xl" color="alternative" class="mr-3 inline-flex items-center justify-center"
        >Find out more</Button
      >
    </a>
  </HeroHeader>
</div>
