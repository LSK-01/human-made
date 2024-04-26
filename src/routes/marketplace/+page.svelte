<script lang="ts">
    import {Title, loadMarketplace, queries, type Product} from '$lib';
	import MarketDiv from '$lib/components/MarketDiv.svelte';
	import type { Query } from 'firebase/firestore';

    export let data;
    let marketplace: Product[] = data.marketplace;

    let currQueryString = 'recents';
    let currQuery: Query = queries[currQueryString];
    
    let reloadMarket = async (currQueryString: string) => {
        currQuery = queries[currQueryString];
        console.log('reloading market');
        marketplace = await loadMarketplace(currQuery);
    }

    $: reloadMarket(currQueryString);
</script>

<svelte:head>
	<title>Marketplace</title>
</svelte:head>

<Title>Marketplace</Title>
<select
	name="options"
	id="options-dropdown"
	class="text-lg text-secondary"
	bind:value={currQueryString}
>
	<option value="recents">Recent</option>
	<option value="mostLiked">Most Liked</option>
</select>
{#each marketplace as product}
	<MarketDiv {product} />
{/each}
