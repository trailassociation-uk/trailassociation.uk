<script lang="ts">
	import {
		Section,
		ContentWithImage,
		HeroHeader,
		FeatureDefault,
		FeatureItem
	} from 'flowbite-svelte-blocks';
	import {
		DollarSolid,
		RocketSolid,
		NewspaperSolid,
		UserGroupSolid,
		FileLinesSolid,
		EnvelopeSolid
	} from 'flowbite-svelte-icons';
</script>

<div
	class="h-36 w-full bg-[url('https://images.unsplash.com/photo-1650841118149-420f91fa94b8?q=80&w=1080&h=300&fit=crop&crop=focalpoint')] bg-cover md:h-80 lg:-mb-20"
>
	<!-- <h1 class="px-12 py-8 text-5xl font-extrabold text-white md:px-48 md:py-24">About us</h1> -->
</div>
<Section name="contentwithimg">
	<ContentWithImage>
		<svelte:fragment slot="h2">Digging is hard enough</svelte:fragment>
		<p class="mb-4">
			We want to let you focus on the thing that matters - getting more MTB trails on the map!
		</p>
		<p>
			Trailassociation.uk is your tool to help empower and organise your local trails. It's designed
			to help you move from digging in the local woods without permission, to running official
			trails that won't be torn down.
		</p>

		<svelte:fragment slot="image">
			<img
				class="w-full rounded-lg"
				src="https://images.unsplash.com/photo-1627848202744-9180fd73f2b1?w=900&auto=format&fit=crop&q=60"
				alt="office content 1"
			/>
			<img
				class="mt-4 w-full rounded-lg lg:mt-10"
				src="https://images.unsplash.com/photo-1585483266684-b2f19ff1ba1d?w=900&auto=format&fit=crop&q=60"
				alt="office content 2"
			/>
		</svelte:fragment>
	</ContentWithImage>
</Section>
<div class="-mt-20 md:-mt-28">
<Section name="feature">
	<HeroHeader
		class="mb-8 max-w-screen-md lg:mb-16"
		h2Class="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white"
		pClass="text-gray-500 sm:text-xl dark:text-gray-400"
	>
		<svelte:fragment slot="h2">Full of features</svelte:fragment>
		<svelte:fragment slot="paragraph"
			>Just enough stuff, without any fluff! We want managaing your trail association to be easy so we focus on providing features you want to <span class="line-through">ride</span> use.</svelte:fragment
		>
	</HeroHeader>
	<FeatureDefault>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><RocketSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Website</svelte:fragment>
			<svelte:fragment slot="paragraph"
				>A website for you hosted at you.trailassociation.uk. Automatically generated for you.</svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><DollarSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Donations</svelte:fragment>
			<svelte:fragment slot="paragraph"
				></svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><NewspaperSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">News and events</svelte:fragment>
			<svelte:fragment slot="paragraph"
				></svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><EnvelopeSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Contact forms</svelte:fragment>
			<svelte:fragment slot="paragraph"
				></svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><FileLinesSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Guides and resources</svelte:fragment>
			<svelte:fragment slot="paragraph"
				></svelte:fragment
			>
		</FeatureItem>
		<FeatureItem>
			<svelte:fragment slot="icon"
				><UserGroupSolid class="text-primary-600 dark:text-primary-300" /></svelte:fragment
			>
			<svelte:fragment slot="h3">Maintainer forums</svelte:fragment>
			<svelte:fragment slot="paragraph"
				></svelte:fragment
			>
		</FeatureItem>
	</FeatureDefault>
</Section>

</div>