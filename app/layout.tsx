import { ServiceProvider } from '@/src/contexts/service.context';
import './globals.css';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/src/contexts/theme-provider';
import AdminAvatar from '@/src/components/Admin/Avatars/AdminAvatar';
import ModeToggle from '@/src/components/Buttons/ModeToggle';
import { PeriodProvider } from '@/src/contexts/period.context';
import { BookingProvider } from '@/src/contexts/booking.context/booking.context';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Service manager',
  description: 'Service manager app with React',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ServiceProvider>
        <PeriodProvider>
          <BookingProvider>
            <body className={inter.className}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <div className='flex gap-4 m-4 items-center justify-end'>
                  <AdminAvatar />
                  <ModeToggle />
                </div>
                {children}
              </ThemeProvider>
            </body>
          </BookingProvider>
        </PeriodProvider>
      </ServiceProvider>
    </html>
  )
}