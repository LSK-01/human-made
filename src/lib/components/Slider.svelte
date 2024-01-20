<script lang="ts">
    import {Subtitle} from '$lib';
    export let min = 0;
    let sliderValue = min; // Default value

    function handleSliderChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        sliderValue = +inputElement.value;
    }
</script>

<div class="slider-container p-4 flex flex-row items-baseline">
    <input
        type="range"
        min={min}
        max="100"
        value={min}
        on:input={handleSliderChange}
        class="slider w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer"
    />
    <div class="ml-5" id="sliderValue">
        <Subtitle>{sliderValue}</Subtitle>
    </div>
    <Subtitle>%</Subtitle>
</div>