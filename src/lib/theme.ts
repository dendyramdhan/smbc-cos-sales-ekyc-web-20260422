import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineSlotRecipe,
} from '@chakra-ui/react';
import { cardAnatomy } from '@chakra-ui/react/anatomy';

const cardSlotRecipe = defineSlotRecipe({
  slots: cardAnatomy.keys(),
  base: {
    root: {
      borderRadius: 'xl',
    },
  },
  variants: {
    variant: {
      elevated: {},
      outline: {},
      subtle: {},
    },
  },
  defaultVariants: {
    variant: 'elevated',
  },
});

const config = defineConfig({
  globalCss: {
    body: {
      bg: '#f8fafc',
      color: 'gray.800',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#22c55e' },
          600: { value: '#16a34a' },
          700: { value: '#15803d' },
          800: { value: '#166534' },
          900: { value: '#14532d' },
        },
        surface: {
          light: { value: '#ffffff' },
          dark: { value: '#1a202c' },
        },
        background: { value: '#f8fafc' },
      },
    },
    recipes: {
      button: {
        base: {
          fontWeight: '600',
          borderRadius: 'lg',
        },
        variants: {
          variant: {
            solid: {
              bg: 'brand.600',
              color: 'white',
              _hover: { bg: 'brand.700' },
            },
            ghost: {
              color: 'brand.600',
              _hover: { bg: 'brand.50' },
            },
          },
        },
      },
    },
    slotRecipes: {
      card: cardSlotRecipe,
    },
  },
});

export const system = createSystem(defaultConfig, config);
