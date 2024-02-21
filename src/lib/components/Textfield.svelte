<script>
	export let name = '';
	export let placeholder = '';
    export let size = 'md';
    export let text = '';
    export let id = '';

</script>

<input name={name} id={id} bind:value={text} placeholder={placeholder} type="text" class={`border-4 focus:outline-none focus:ring focus:ring-secondary align-top text-left pl-2 break-words text-primary ${size === 'sm' ? 'w-56 h-9' : size === 'md' ? 'w-96 h-12' : ' w-9/12  h-12'}`} />
