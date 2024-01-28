<script lang="ts">
  import { onMount } from "svelte";
  import { Section } from "flowbite-svelte-blocks";

  import { Label, Input, Button, Fileupload } from "flowbite-svelte";

  import { pb, user } from "$lib/pocketbase";
  import { goto } from "$app/navigation";

  let usersName: string = "";
  let usersEmail: string = "";
  let avatar: FileList;

  onMount(async () => {
    if (!$user) {
      goto("/");
    }

    usersName = pb.authStore.model?.name;
    usersEmail = pb.authStore.model?.email;
  });

  async function handleSubmit(e) {
    e.target.checkValidity();

    const formData = new FormData(e.target);

    await pb.collection("maintainers").update($user?.id, formData);

    const { record, token } = await pb.collection("maintainers").authRefresh();

    pb.authStore.save(token, record);

    $user = record;

    goto("/settings");
  }
</script>

<div class="my-6 rounded bg-green-50 dark:bg-gray-800 lg:mx-auto lg:w-1/2">
  <Section name="crudcreateform">
    <h2 class="-mt-12 mb-4 text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div class="col-span-1">
          <Label for="name" class="mb-2">Name</Label>
          <Input type="text" name="name" id="name" bind:value={usersName} />
        </div>
        <div class="col-span-1">
          <Label for="mail" class="mb-2">Email</Label>
          <Input type="email" name="email" id="mail" bind:value={usersEmail} required />
        </div>
        <div class="col-span-2">
          <Label for="avatar" class="mb-2">Avatar</Label>
          <Fileupload id="avatar" name="avatar" bind:files={avatar} />
        </div>
        <Button type="submit" class="w-32">Save</Button>
      </div>
    </form>
    <hr class="my-8" />
    <h2 class="text-md mb-4 font-bold text-gray-900 dark:text-white">Change password</h2>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
        <div class="col-span-2">
          <Label for="oldPassword" class="mb-2">Old password</Label>
          <Input id="oldPassword" name="oldPassword" type="password" required />
        </div>
        <div class="col-span-2">
          <Label for="newPassword" class="mb-2">New password</Label>
          <Input id="newPassword" name="password" type="password" required />
        </div>
        <div class="col-span-2">
          <Label for="confirmNewPassword" class="mb-2">Confirm new password</Label>
          <Input id="confirmNewPassword" name="passwordConfirm" type="password" required />
        </div>
        <Button type="submit" class="w-32">Submit</Button>
      </div>
    </form>
  </Section>
</div>
