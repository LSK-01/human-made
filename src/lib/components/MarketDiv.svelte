<script lang="ts">
	import type { Commit } from '$lib';

	export let commit: Commit;
</script>

<div class="mt-5 w-7/12 h-40 rounded-2xl bg-opacity-80 bg-primary py-4">
	<div class="ml-5 text-xl text-secondary">
		{commit.percentage}
	</div>
	<div class="ml-5 text-lg text-white">
		{commit.description}
	</div>
	<div>
		<i class="fas fa-plus text-xl mb-2"></i>
	</div>
    <div class="w-10 h-32 bg-quaternary"></div>
</div>
