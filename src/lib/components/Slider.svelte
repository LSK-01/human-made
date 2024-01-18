<script lang="ts">
    let sliderValue = 50; // Default value
    import {Subtitle} from '$lib';

    function handleSliderChange(event: Event) {
        const inputElement = event.target as HTMLInputElement;
        sliderValue = +inputElement.value;
    }
</script>

<div class="slider-container p-4 flex flex-row items-baseline">
    <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        on:input={handleSliderChange}
        class="slider w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer"
    />
    <div class="ml-5" id="sliderValue">
        <Subtitle>{sliderValue}%</Subtitle>
    </div>
</div>