<script lang="ts">
    export let click = () => {};
    export let size = 'md';
    export let submit = true;
</script>
   
 <button on:click={click} type={submit ? 'submit' : 'button'} class={`bg-primary rounded-lg hover:bg-secondary shadow-md text-lg
    ${size === 'sm' ? 'w-20 h-8' : size === 'md' ? 'w-40 h-12' : 'w-60 h-16'} text-white`}>
    <slot></slot>
</button>