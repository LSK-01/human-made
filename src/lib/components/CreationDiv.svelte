
<script lang="ts">
	import type { Creation } from '$lib';

    export let creation: Creation;

</script>

<div class={`ml-5 mt-5 w-7/12 h-40 rounded-2xl bg-primary py-4`}>
    <div class="ml-5 text-xl text-secondary">
        {creation.name}
    </div>
    <div class="ml-5 text-lg text-white">
        <span class="text-tertiary">{creation.type}</span>
        {creation.description}
    </div>
</div>