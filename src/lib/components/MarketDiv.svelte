<script lang="ts">
	import type { Commit, Product } from '$lib';
	import { goto } from '$app/navigation';
	export let product: Product;
	let liked = false;

	let goToCreation = () => {
		goto(`/creations/${product.id}`);
	}

	let processLike = () => {
		liked = !liked;
	}
</script>

<div class="mt-5 pl-5 w-7/12 h-40 rounded-2xl bg-opacity-80 bg-primary py-4 hover:cursor-pointer" >
	<div class="text-xl text-secondary" on:click={goToCreation}>
		{product.name}
	</div>
	<div class="text-lg text-white">
		{product.description}
	</div>
	<div class="last:text-lg text-tertiary">
		{product.creator}
	</div>
	<i class={`${liked ? 'text-secondary' : 'text-white'} fas fa-heart text-lg hover:text-secondary cursor-pointer`} on:click={processLike}></i>
</div>
