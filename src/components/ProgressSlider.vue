<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, ref, Ref } from "vue";

const props = defineProps({
    value: Number,
    max: {
        type: Number,
        default: 1,
    },
    min: {
        type: Number,
        default: 0,
    },
    step: {
        type: Number,
        default: 1,
    },
});

const slider: Ref<HTMLElement> = ref(null);
const emit = defineEmits(["update:value"]);

const value = computed({
    get: (): number => props.value,
    set: (val: number): void => {
        emit("update:value", val);
        updateProgress(val);
    }
});

function updateProgress(val: number) {
    const min = props.min;
    const max = props.max;
    const p = ((val - min) * 100) / (max - min);
    const style = slider.value.style;
    let bg = `linear-gradient(90deg, var(--accent) ${p}%, var(--bg2) ${p}%)`;
    /*bg = "linear-gradient(90deg,black 50%,grey 50%)";*/
    style.setProperty("--slider-progress", bg);
    console.log(slider.value.style);
}

onMounted(() => {
    updateProgress(props.value);
});
</script>

<template>
    <div class="progress-slider" ref="slider">
        <input
            type="range"
            v-model="value"
            :max="max"
            :step="step"
        />
    </div>
</template>

<style>
.progress-slider {
    width: 100%;
}

.progress-slider > input {
    appearance: none;
    -webkit-appearance: none;
    outline: 0;
    padding: 0;
    width: 100%;
}

.progress-slider > input:focused {
    outline: 0;
    border-color: transparent;
}

.progress-slider input::-webkit-slider-runnable-track {
    cursor: pointer;
    background: var(--slider-progress);
    /*background: linear-gradient(90deg,black 50%,grey 50%);*/
    border-radius: 8px;
    height: 8px;
}

.progress-slider input::-webkit-fill-lower,
.progress-slider input::-moz-range-progress {
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--accent);
}

.progress-slider input::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 24px;
    width: 24px;
    margin-top: -8px;
    background-color: var(--accent);
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}
</style>
