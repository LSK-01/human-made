
<script lang="ts">
	import type { Creation } from '$lib';
    import { goto } from '$app/navigation';
    export let creation: Creation;

    function goToCreation(){
        goto(`/creations/${creation.id}`);
    }
</script>

<div on:click={goToCreation} class="mt-5 w-7/12 h-40 rounded-2xl bg-opacity-80 bg-primary py-4">
    <div class="ml-5 text-xl text-secondary">
        {creation.name}
    </div>
    <div class="ml-5 text-lg text-white">
        <span class="text-tertiary">{creation.type}</span>
        {creation.description}
    </div>
</div>