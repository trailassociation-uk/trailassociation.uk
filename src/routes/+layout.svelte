<script>
	import '../app.pcss';

	import { page } from '$app/stores';
	import { pb, user } from '$lib/pocketbase';

	import {
		Navbar,
		NavBrand,
		NavLi,
		NavUl,
		NavHamburger,
		DarkMode,
		Dropdown,
		DropdownHeader,
		DropdownItem,
		DropdownDivider,
		Avatar,
		Button
	} from 'flowbite-svelte';

	import { ChevronDownOutline, MapLocationOutline } from 'flowbite-svelte-icons';

	$: activeUrl = $page.url.pathname;

	const subdomain = $page.url.hostname.split('.')[0];

	function logout() {
		$user = null;
	}
</script>

<Navbar color="green">
	<NavBrand href="/">
		<MapLocationOutline class="mx-2 text-red-600 dark:text-red-500" />
		<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
			>Trail Association</span
		>
	</NavBrand>
	<NavUl {activeUrl} class="order-1">
		<NavLi href="/about">About</NavLi>
		<NavLi href="/associations">Associations</NavLi>
		<NavLi class="cursor-pointer">
			Guides<ChevronDownOutline class="ms-2 inline h-3 w-3 text-primary-800 dark:text-white" />
		</NavLi>
		<Dropdown class="z-20 w-60">
			<h2 class="text-md mx-3 mb-2 mt-4 font-black text-red-600 dark:text-red-500">
				Getting permission
			</h2>
			<DropdownItem href="/guides/who-owns-the-land">Who owns the land?</DropdownItem>
			<DropdownItem href="/guides/approaching-landowners">Approaching landowners</DropdownItem>
			<DropdownItem href="/guides/types-of-agreements">Types of agreements</DropdownItem>
			<!-- <DropdownDivider /> -->
			<h2 class="text-md mx-3 mb-2 mt-4 font-black text-red-600 dark:text-red-500">
				Running an association
			</h2>
			<DropdownItem href="/guides/setting-up-a-registered-charity"
				>Setting up a registered charity</DropdownItem
			>
			<DropdownItem href="/guides/organising-meetings">Organising meetings</DropdownItem>
		</Dropdown>
		<NavLi class="cursor-pointer">
			Resources<ChevronDownOutline class="ms-2 inline h-3 w-3 text-primary-800 dark:text-white" />
		</NavLi>
		<Dropdown class="z-20 w-60">
			<h2 class="text-md mx-3 mb-2 mt-4 font-black text-red-600 dark:text-red-500">Templates</h2>
			<DropdownItem href="/resources/letter-to-private-landowner"
				>Inquiry to private landowner</DropdownItem
			>
			<DropdownItem href="/resources/letter-to-local-authority"
				>Inquiry to local authority</DropdownItem
			>
			<!-- <DropdownDivider /> -->
			<h2 class="text-md mx-3 mb-2 mt-4 font-black text-red-600 dark:text-red-500">Checklists</h2>
			<DropdownItem href="/guides/trail-association-checklist"
				>Trail association checklist</DropdownItem
			>
		</Dropdown>
	</NavUl>

	<div class="flex items-center md:order-2">
		{#if $user}
			<Avatar id="avatar-menu" src={pb.getFileUrl($user, $user?.avatar)} class="mx-6" />

			<Dropdown placement="bottom" triggeredBy="#avatar-menu">
				<DropdownHeader>
					<span class="block text-sm">{$user?.name}</span>
					<span class="block truncate text-sm font-medium">{$user?.email}</span>
				</DropdownHeader>
				<DropdownItem>Dashboard</DropdownItem>
				<DropdownItem>Settings</DropdownItem>
				<DropdownDivider />
				<DropdownItem on:click={logout}>Sign out</DropdownItem>
			</Dropdown>
		{:else}
			<a href="/login"
				><Button size="md" color="red" class="mr-3 inline-flex items-center justify-center"
					>Login</Button
				>
			</a>
		{/if}
		<DarkMode class="mx-3" />
		<NavHamburger class1="w-full md:flex md:w-auto md:order-1" />
	</div>
</Navbar>

<slot />
