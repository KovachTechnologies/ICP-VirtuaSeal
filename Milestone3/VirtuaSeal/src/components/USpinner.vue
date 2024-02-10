<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { withDefaults, defineProps } from 'vue';

const defaultClasses = 'inline-flex justify-center items-center overflow-hidden border-transparent';
const spinner = cva(defaultClasses, {
    variants: {
        color: {
            brand: 'stroke-brand',
            error: 'stroke-error',
            warning: 'stroke-warning',
            success: 'stroke-success',
            info: 'stroke-info',
            help: 'stroke-help',
            gray: 'stroke-gray',
            white: 'stroke-white',
        },
        size: {
            xs: 'h-4 w-4',
            sm: 'h-4.5 w-4.5',
            md: 'h-5 w-5',
            lg: 'h-5 w-5',
            xl: 'h-6 w-6',
            '2xl': 'h-8 w-8',
        },
    },
    compoundVariants: [],
    defaultVariants: {},
});

type SpinnerProps = VariantProps<typeof spinner>;

withDefaults(
    defineProps<{
        color?: SpinnerProps['color'];
        size?: SpinnerProps['size'];
    }>(),
    {
        color: 'brand',
        size: 'md',
    },
);
</script>

<template>
    <div class="u-spinner" :class="spinner({ color, size })" role="progressbar">
        <svg style="animation: rotate 1s linear infinite" viewBox="25 25 50 50">
            <circle class="u-spinner__underlay" :class="spinner" cx="50" cy="50" r="20" />
            <circle class="u-spinner__overlay" :class="spinner" cx="50" cy="50" r="20" />
        </svg>
    </div>
</template>

<style lang="css">
.u-spinner__underlay,
.u-spinner__overlay {
    fill: none;
    stroke-width: 5;
}

.u-spinner__underlay {
    @apply opacity-20;
}

.u-spinner__overlay {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: stretch calc(2s * 0.75) ease-in-out infinite;
}

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes stretch {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }
    50% {
        stroke-dasharray: 75, 200;
        stroke-dashoffset: -35px;
    }
    100% {
        stroke-dashoffset: -124px;
    }
}
</style>
