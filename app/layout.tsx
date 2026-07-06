import './globals.css';
import { DM_Serif_Display, Lora, JetBrains_Mono } from 'next/font/google';

const dmSerif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
});

const lora = Lora({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-body',
});

const jetbrains = JetBrains_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'sites4u',
  description: 'we are a b2b website agency, we build professional websites for SMEs who are still not online, we help with marketing, small family run businesses and smaller independent businesses to rival the big corps',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${lora.variable} ${jetbrains.variable}`}>
      <body className="bg-[#FBF9F6] text-[#2C1E18] antialiased min-h-screen selection:bg-[#C56A3C]/20 selection:text-[#C56A3C]">
        {children}
      </body>
    </html>
  );
}