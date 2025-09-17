// On ne supprime pas "Metadata", mais on peut supprimer les imports de polices
import type { Metadata } from 'next';
// SUPPRIMEZ TOUTES LES LIGNES SUIVANTES :
// import { Inter, Space_Grotesk, Press_Start_2P, VT323, Orbitron } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Chatbot } from '@/components/chatbot';
import { AuthProvider } from '@/hooks/use-auth';
import { getDictionary } from '@/lib/i18n';

// SUPPRIMEZ TOUTES CES CONSTANTES DE POLICES
/*
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const pressStart2P = Press_Start_2P({ subsets: ['latin'], weight: '400', variable: '--font-press-start-2p' });
const vt323 = VT323({ subsets: ['latin'], weight: '400', variable: '--font-vt323' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
*/

export const metadata: Metadata = {
  title: 'Portfolio | Alex ONDO',
  description: "Le portfolio d'Alex Ondo, Développeur Junior en Alternance.",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const lang = params.lang || 'fr';
  const dictionary = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      {/* AJOUTEZ CES LIGNES DANS LA BALISE <head> */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Orbitron&family=Press+Start+2P&family=Space+Grotesk:wght@400;700&family=VT323&display=swap" rel="stylesheet" />
      </head>
      {/* MODIFIEZ la props `className` de la balise <body> */}
      <body className={cn('min-h-screen bg-background font-body antialiased')}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            themes={['dark', 'forest', 'cyberpunk', 'ocean', 'synthwave', 'noir']}
          >
            <div className="relative flex min-h-screen flex-col">
              <Header dictionary={dictionary.header} />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Chatbot />
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}