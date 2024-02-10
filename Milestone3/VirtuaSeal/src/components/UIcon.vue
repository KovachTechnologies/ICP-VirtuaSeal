<script setup lang="ts">
import { withDefaults } from 'vue';
import { Icon } from '@iconify/vue';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';

// defineOptions({
//   inheritAttrs: false,
// });

const iconClasses = cva('', {
    variants: {
        size: {
            xs: 'w-4 h-4',
            sm: 'w-5 h-5',
            md: 'w-6 h-6',
            lg: 'w-7 h-7',
            xl: 'w-8 h-8',
        },
    },
});

type IconProps = VariantProps<typeof iconClasses>;

withDefaults(
    defineProps<{
        icon: string;
        variant?: string;
        size?: IconProps['size'];
    }>(),
    {
        icon: '',
        variant: 'line',
        size: 'md',
    },
);
</script>

<template>
    <Icon
        :icon="icon.includes('@') ? icon : icon.includes(':') ? `@uinified:${icon}` : `@uinified:${variant}:${icon}`"
        :class="twMerge(iconClasses({ size }), $attrs.class as string)"
    />
</template>
