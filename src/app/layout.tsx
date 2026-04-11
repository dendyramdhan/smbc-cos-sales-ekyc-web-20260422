import type { Metadata } from 'next';
import './globals.css';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'KYC Dashboard - SMBC',
  description: 'Advanced KYC Checklist BES System',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en">
      <body>
        <Providers>
          <DashboardLayout>{children}</DashboardLayout>
        </Providers>
      </body>
    </html>
  );
}
