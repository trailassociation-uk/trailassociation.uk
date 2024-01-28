<script>
  import { Section, Page404, Page500 } from "flowbite-svelte-blocks";
  import { Button } from "flowbite-svelte";

  import { page } from "$app/stores";
</script>

{#if $page.error?.message === "Not Found"}
  <Section name="page404">
    <Page404>
      <svelte:fragment slot="h1">404</svelte:fragment>
      <svelte:fragment slot="paragraph">
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          We couldn't find that!
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Looks like the diggers have been through and flattened this bit.
        </p>
        <Button href="/" size="lg" color="red">Go home</Button>
      </svelte:fragment>
    </Page404>
  </Section>
{:else}
  <Section>
    <Page500>
      <svelte:fragment slot="h1">Uh oh!</svelte:fragment>
      <svelte:fragment slot="paragraph">
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          Something went wrong!
        </p>
        <p class="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
          Please try again - if the error persists, contact us.
        </p>
      </svelte:fragment>
    </Page500>
  </Section>
{/if}
