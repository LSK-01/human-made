<script lang="ts">
    import {Button} from '$lib';
    export let buttonText: string;
    export let infoText: string;
    export let click = () => {};
</script>
<div>
    <Button click={click}>{buttonText}</Button>
    <div class="group relative inline-grid">
        <i class="fas fa-circle-info text-xl ml-2 text-primary"></i>
        <div class="speech-bubble group-hover:opacity-100 w-60 group-hover:visible absolute bottom-full left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded p-2 opacity-0 invisible transition-opacity duration-200 mb-1">
            {infoText}
        </div>
    </div>
</div>