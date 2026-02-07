import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Luxury Dinner Cruise Dubai | 135-Seat Premium Yacht Experience',
    description: 'Experience an unforgettable evening with dining, live entertainment, and Dubai skyline views on a luxury 135-seat yacht departing from Dubai Marina.',
    keywords: 'Dubai dinner cruise, luxury yacht, Dubai Marina, dinner cruise Dubai, yacht dinner, Dubai skyline cruise',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
