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
          50: { value: '#e6f2ed' },
          100: { value: '#c0dfcf' },
          200: { value: '#8fc4a8' },
          300: { value: '#5aa882' },
          400: { value: '#2d8f60' },
          500: { value: '#00703d' },
          600: { value: '#004b34' },
          700: { value: '#003828' },
          800: { value: '#00261b' },
          900: { value: '#00150e' },
        },
        accent: {
          50: { value: '#f7fcd6' },
          100: { value: '#eef8ab' },
          200: { value: '#e2f27a' },
          300: { value: '#d4ea4d' },
          400: { value: '#c8e12a' },
          500: { value: '#bfd730' },
          600: { value: '#9db020' },
          700: { value: '#7a8a14' },
          800: { value: '#57640c' },
          900: { value: '#343d05' },
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
              _hover: { bg: 'accent.500', color: 'brand.600' },
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
