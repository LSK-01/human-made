<script lang="ts">
    export let click = () => {};
    export let size = 'md';
    export let submit = true;
    export let icon = ''
</script>
   
 <button on:click={click} type={submit ? 'submit' : 'button'} class={`flex flex-row items-center justify-center bg-primary rounded-lg hover:bg-secondary shadow-md
    ${size === 'sm' ? 'w-20 h-8 text-sm' : size === 'md' ? 'w-40 h-12 text-lg' : 'w-60 h-16 text-lg'} text-white`}>
    <i class={`fas ${icon} ${icon != '' ? 'mr-2' : ''} ${size === 'sm' ? 'text-sm' : 'text-lg'}`}></i>

    <slot></slot>
</button>
