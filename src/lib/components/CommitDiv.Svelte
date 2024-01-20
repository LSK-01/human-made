<script lang="ts">
	import type { Commit } from '$lib';
	import {fade} from 'svelte/transition';
	export let commit: Commit;

	function extractType(filename: string) {
		const parts = decodeURIComponent(filename).split('+');
		return parts[0];
	}
</script>

<div class="flex flex-col gap-5 mt-5 w-7/12 rounded-2xl bg-opacity-80 bg-primary" in:fade={{ duration: 300 }}>
	<div class="max-w-full max-h-full p-5">
		<div class="flex flex-row gap-5 mb-5 align-bottom">
			<div class="text-xl text-secondary">
				{commit.percentage}%
			</div>
			<div class="text-lg text-white">
				{commit.description}
			</div>
		</div>
		<div class="bg-tertiary p-5 rounded-md">
			<ul class="flex flex-row flex-wrap flex-grow justify-start gap-2">
				{#each Object.entries(commit.evidence) as [filename, url]}
					<li class="flex-item flex-grow">
						{#if filename.startsWith('image')}
							<img class="h-24 object-contain rounded-md" src={url} alt={filename} />
						{:else if filename.startsWith('audio')}
							<audio controls class="h-24">
								<source src={url} type={extractType(filename)} />
								Your browser does not support the audio tag.
							</audio>
						{:else if filename.startsWith('video')}
							<video controls class="h-24">
								<track kind="captions" />
								<source src={url} type={extractType(filename)} />
								Your browser does not support the video tag.
							</video>
						{:else}
							<a href={url} download={filename} class="text-white">Download {extractType(filename)}</a>
						{/if}
					</li>
				{/each}
			</ul>
		</div>
	</div>
</div>
