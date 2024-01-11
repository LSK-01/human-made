
<script lang="ts">
	import type { Creation } from '$lib';

    export let creation: Creation;

</script>

<div class={`ml-5 mt-5 w-7/12 h-40 rounded-2xl bg-slate-200`}>
    {creation.name}
    {creation.id}
</div>