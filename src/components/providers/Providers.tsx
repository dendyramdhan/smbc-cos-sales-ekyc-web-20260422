'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider } from 'next-themes';
import { system } from '@/lib/theme';
import React from 'react';

type ProvidersProps = {
  children: React.ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }: ProvidersProps) => {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" defaultTheme='light' enableSystem={false}>{children}</ThemeProvider>
    </ChakraProvider>
  );
};
export default Providers;
