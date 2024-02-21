<script lang="ts">
    import {Subtitle} from '$lib';
    export let min = 0;
    export let sliderValue = min; // Default value
</script>

<div class="slider-container p-4 flex flex-row items-baseline">
    <input
        type="range"
        min={min}
        max=100
        bind:value={sliderValue}
        class="slider w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer"
    />
    <div class="ml-5" id="sliderValue">
        <Subtitle>{sliderValue}</Subtitle>
    </div>
    <Subtitle>%</Subtitle>
</div>