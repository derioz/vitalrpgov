import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';
import { ThemeProvider } from '@/context/ThemeContext';
import { outfit, jakarta } from './fonts';
import LayoutShell from '@/components/LayoutShell';

export const metadata: Metadata = {
  title: 'San Andreas Government',
  description: 'Official website of the Government of San Andreas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} ${outfit.variable} font-sans`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          <Providers>
            <LayoutShell>
              {children}
            </LayoutShell>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
