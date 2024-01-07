<script>
	import '../tailwind.css';
    const fontAwesomePath = import.meta.env.VITE_FONTAWESOME_PATH;
    import {Sidebar} from '$lib';
</script>

<svelte:head>
    <link rel="stylesheet" href={fontAwesomePath} />
</svelte:head>

<main class="flex">
    <Sidebar />
    <div class="flex-grow">
        <slot />
    </div>
</main>
