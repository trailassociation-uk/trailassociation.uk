<script lang="ts">
	import { Section, Register } from 'flowbite-svelte-blocks';
	import { Button, Checkbox, Label, Input } from 'flowbite-svelte';
	import { MapLocationOutline } from 'flowbite-svelte-icons';

	import { pb, user } from '$lib/pocketbase';

	import { goto } from '$app/navigation';

	if ($user) {
		goto('/');
	}

	async function create(e) {
		const user = await pb.collection('maintainers').create(new FormData(e.target));

		if (user) {
			goto('/');
		}
	}
</script>

<div
	class="h-screen bg-[url('https://images.unsplash.com/photo-1516214104703-d870798883c5?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover"
>
	<div class="mx-auto max-w-xl py-12">
		<Section name="register">
			<Register href="/">
				<svelte:fragment slot="top">
					<MapLocationOutline class="mx-2 text-red-600 dark:text-red-500" size="xl" />
				</svelte:fragment>
				<div class="space-y-4 p-6 sm:p-8 md:space-y-6">
					<form class="flex flex-col space-y-6" on:submit|preventDefault={create}>
						<h3 class="p-0 text-xl font-medium text-gray-900 dark:text-white">
							Create an association maintainer account
						</h3>
						<span class="text-sm italic text-gray-500 dark:text-gray-300"
							>Only required if you maintain an association. If you just dig or ride - you don't
							need an account.</span
						>
						<Label class="space-y-2">
							<span>Your email</span>
							<Input type="email" name="email" placeholder="you@email.com" required />
						</Label>
						<Label class="space-y-2">
							<span>Your password</span>
							<Input type="password" name="password" placeholder="•••••••••••••••" required />
						</Label>
						<Label class="space-y-2">
							<span>Confirm password</span>
							<Input
								type="password"
								name="passwordConfirm"
								placeholder="•••••••••••••••"
								required
							/>
						</Label>
						<div class="flex items-start">
							<Checkbox
								>I accept the &nbsp;<a
									class="font-medium text-primary-600 hover:underline dark:text-primary-500"
									href="/terms"
								>
									Terms and Conditions</a
								></Checkbox
							>
						</div>
						<Button type="submit" class="w-full1">Create an account</Button>
						<div class="text-sm font-medium text-gray-500 dark:text-gray-300">
							Already have an account? <a
								href="/login"
								class="font-medium text-primary-600 hover:underline dark:text-primary-500"
								>Login here</a
							>
						</div>
					</form>
				</div>
			</Register>
		</Section>
	</div>
</div>
