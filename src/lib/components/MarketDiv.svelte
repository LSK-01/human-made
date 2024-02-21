<script lang="ts">
	import type { Commit, Product } from '$lib';
	import { goto } from '$app/navigation';
	export let product: Product;

	let goToCreation = () => {
		goto(`/creations/${product.id}`);
	}

	let processLike = () => {

	}
</script>

<div class="mt-5 pl-5 w-7/12 h-40 rounded-2xl bg-opacity-80 bg-primary py-4 hover:cursor-pointer" on:click={goToCreation}>
	<div class="text-xl text-secondary">
		{product.name}
	</div>
	<div class="text-lg text-white">
		{product.description}
	</div>
	<div class="last:text-lg text-tertiary">
		{product.creator}
	</div>
	<i class="fas fa-heart text-lg text-white hover:text-secondary cursor-pointer" on:click={processLike}></i>
</div>
