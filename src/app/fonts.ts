import { Outfit, Plus_Jakarta_Sans } from 'next/font/google';

export const outfit = Outfit({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-outfit',
});

export const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-jakarta',
});
