<script>
	export let name = '';
	export let placeholder = '';
    export let type = 'text';
    export let size = 'md';
</script>

<input name={name} placeholder={placeholder} type={type} class={`mb-4 border-4 focus:outline-none focus:ring focus:ring-secondary align-top text-left pl-2 break-words text-primary ${size === 'sm' ? 'w-56 h-9' : size === 'md' ? 'w-64 h-12' : ' w-96  h-12'}`} />
