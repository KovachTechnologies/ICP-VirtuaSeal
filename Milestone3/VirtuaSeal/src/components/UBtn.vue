<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { withDefaults, defineProps } from 'vue';
import UIcon from './UIcon.vue';
import USpinner from './USpinner.vue';

const iconClass = cva('', {
    variants: {
        size: {
            xs: 'w-4 h-4',
            sm: 'w-5 h-5',
            md: 'w-5 h-5',
            lg: 'w-5 h-5',
            xl: 'w-6 h-6',
        },
    },
});

const defaultClasses =
    'font-semibold relative rounded-lg ' +
    'inline-flex justify-center items-center gap-x-2 ' +
    'transition-all duration-100 cursor-pointer ease-in-out focus:z-50 ' +
    'outline outline-0 border border-transparent';

const button = cva(defaultClasses, {
    variants: {
        color: {
            brand: '',
            error: '',
            gray: '',
        },
        variant: {
            default: 'shadow-xs focus:outline-4',
            outlined: 'shadow-xs focus:outline-4',
            text: 'bg-primary border-transparent shadow-none',
            link: 'underline border-transparent !p-0 !h-fit',
            plain: '',
            close: `
        outline-gray-400/20 focus:outline-4
        hover:bg-primary_hover focus:bg-primary fg-quinary hover:fg-quinary_hover
        hover:bg-white/20 focus:bg-white/20 dark:text-white dark:hover:text-white
      `,
            'inside-input': '',
        },
        size: {
            xs: 'px-3 py-2 text-xs leading-4 h-[34px]',
            sm: 'px-3.5 py-2 text-sm leading-5 h-9',
            md: 'px-4 py-2.5 text-sm leading-5 h-10',
            lg: 'px-4.5 py-2.5 text-base leading-6 gap-x-2.5 h-11',
            xl: 'px-5 py-3 text-lg leading-6 gap-x-3 h-12',
        },
        disabled: {
            true: 'pointer-events-none',
        },
        loading: {
            true: 'pointer-events-none',
        },
        block: {
            true: 'w-full',
            false: 'w-fit',
        },
        compact: {
            true: 'p-0',
            false: '',
        },
        icon: {
            true: '',
        },
    },
    compoundVariants: [
        {
            variant: 'default',
            color: 'brand',
            class: `
        text-white dark:text-white
        bg-brand-600 hover:bg-brand-700 dark:bg-brand-600 dark:hover:bg-brand-700
        border-brand-600 hover:border-brand-700 dark:border-brand-600 dark:hover:border-brand-700
        disabled:border-disabled_subtle disabled:fg-disabled disabled:bg-disabled
        outline-brand-400/[.24]
      `,
        },
        {
            variant: 'default',
            color: 'error',
            class: `
        text-white dark:text-white
        bg-error-600 hover:bg-error-700 dark:bg-error-600 dark:hover:bg-error-700
        border-error-600 hover:border-error-700 dark:border-error-600 dark:hover:border-error-700
        disabled:border-disabled_subtle disabled:fg-disabled disabled:bg-disabled
        outline-error-400/[.24]
      `,
        },
        {
            variant: 'outlined',
            color: 'brand',
            class: `
        text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-100
        bg-white hover:bg-brand-50 dark:bg-brand-900 dark:hover:bg-brand-800
        border-brand-300 hover:border-brand-300 dark:border-brand-700 dark:hover:border-brand-700
        disabled:border-disabled_subtle disabled:fg-disabled disabled:bg-primary
        outline-brand-400/20
      `,
        },
        {
            variant: 'outlined',
            color: 'error',
            class: `
        text-error-700 hover:text-error-800 dark:text-error-200 dark:hover:text-error-100
        bg-white hover:bg-error-50 dark:bg-error-950 dark:hover:bg-error-900
        border-error-300 hover:border-error-300 dark:border-error-800 dark:hover:border-error-700
        disabled:border-disabled_subtle disabled:fg-disabled disabled:bg-primary
        outline-error-400/20
      `,
        },
        {
            variant: 'outlined',
            color: 'gray',
            class: `
        text-gray-700 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100
        bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800
        border-gray-300 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-700
        disabled:border-disabled_subtle disabled:fg-disabled disabled:bg-primary
        outline-gray-400/20
      `,
        },
        {
            variant: 'text',
            color: 'brand',
            class: `
        text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200
        bg-primary hover:bg-brand-primary_alt
        disabled:fg-disabled
      `,
        },
        {
            variant: 'text',
            color: 'error',
            class: `
        text-error-700 hover:text-error-800 dark:text-error-300 dark:hover:text-error-200
        bg-primary hover:bg-error-50 dark:hover:bg-error-900
        disabled:fg-disabled
      `,
        },
        {
            variant: 'text',
            color: 'gray',
            class: `
        fg-tertiary hover:fg-tertiary_hover dark:hover:text-gray-200
        bg-primary hover:bg-primary_hover
        disabled:fg-disabled
      `,
        },
        {
            variant: 'link',
            color: 'brand',
            class: 'text-brand-700 hover:text-brand-800 dark:text-brand-500 dark:hover:text-brand-400',
        },
        {
            variant: 'link',
            color: 'error',
            class: 'text-error-700 hover:text-error-800 dark:text-error-500 dark:hover:text-error-400',
        },
        {
            variant: 'link',
            color: 'gray',
            class: 'text-gray-700 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300',
        },
        {
            variant: 'link',
            disabled: true,
            class: 'fg-disabled_subtle dark:text-gray-600',
        },
        { icon: true, size: ['xs', 'sm'], class: 'p-2' },
        { icon: true, size: 'md', class: '!p-2.5 w-10' },
        { icon: true, size: ['lg', 'xl'], class: 'p-3' },
    ],
    defaultVariants: {},
});

export type ButtonProps = VariantProps<typeof button>;

withDefaults(
    defineProps<{
        color?: ButtonProps['color'];
        variant?: ButtonProps['variant'];
        size?: ButtonProps['size'];
        disabled?: boolean | ButtonProps['disabled'];
        loading?: boolean | ButtonProps['loading'];
        block?: boolean | ButtonProps['block'];
        compact?: boolean | ButtonProps['compact'];
        href?: string;
        prependIcon?: string;
        icon?: string | ButtonProps['icon'];
        appendIcon?: string;
    }>(),
    {
        color: 'brand',
        variant: 'default',
        size: 'md',
        disabled: false,
        loading: false,
        block: false,
        compact: false,
        href: undefined,
        prependIcon: undefined,
        icon: undefined,
        appendIcon: undefined,
    },
);
</script>

<template>
    <component
        :is="variant === 'link' || href ? 'a' : 'button'"
        :type="variant === 'link' || href ? 'link' : 'button'"
        :href="href"
        class="u-btn"
        :class="[
            twMerge(
                button({
                    color,
                    variant,
                    size,
                    disabled,
                    loading,
                    block,
                    compact,
                    icon: Boolean(icon),
                }),
            ),
        ]"
        :disabled="disabled"
        v-bind="$attrs"
    >
        <span v-if="$slots.prepend || prependIcon" class="u-btn__prepend">
            <slot name="prepend">
                <u-icon :icon="prependIcon" :class="iconClass({ size })" />
            </slot>
        </span>
        <span v-if="$slots.default || icon" class="u-btn__content">
            <slot>
                <u-icon :icon="icon as string" :class="iconClass({ size })" />
            </slot>
        </span>

        <span v-if="$slots.append || appendIcon" class="u-btn__append">
            <slot name="append">
                <u-icon :icon="appendIcon" :class="iconClass({ size })" />
            </slot>
        </span>

        <span
            v-if="loading"
            class="u-btn__loader absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[inherit] rounded-[inherit]"
        >
            <u-spinner
                :size="size"
                :color="['default', 'flat'].includes(variant as string) && color === 'brand' ? 'white' : color"
            />
        </span>
    </component>
</template>

<!-- <style lang="scss">
// .u-btn {
  // @apply font-semibold relative rounded-lg
  //     inline-flex justify-center items-center gap-x-2
  //     transition-all duration-100 ease-in-out
  //     cursor-pointer
  //     focus:z-50;

  // &.u-btn--size-xs {
  //   .u-icon {
  //     @apply w-4 h-4;
  //   }
  // }
  // &.u-btn--size-sm {
  //   .u-icon {
  //     @apply w-5 h-5;
  //   }
  // }
  // &.u-btn--size-md {
  //   .u-icon {
  //     @apply w-5 h-5;
  //   }
  // }
  // &.u-btn--size-lg {
  //   @apply gap-2.5;
  //   .u-icon {
  //     @apply w-5 h-5;
  //   }
  // }
  // &.u-btn--size-xl {
  //   @apply gap-3;
  //   .u-icon {
  //     @apply w-6 h-6;
  //   }
  // }

  // &:disabled {
    // @apply cursor-not-allowed;
  // }
// }

.u-btn {
  .u-btn__prepend {
    grid-area: prepend;
  }
  .u-btn__append {
    grid-area: append;
  }
  .u-btn__content {
    @apply flex items-center justify-center whitespace-nowrap;
    grid-area: content;

    &::first-letter {
      text-transform: uppercase !important;
    }
  }
}
</style> -->
