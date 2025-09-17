
import { getDictionary } from "@/lib/i18n";
import { Mail, Linkedin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function ContactPage({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = await getDictionary(lang);
  const t = dictionary.contact;

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6 text-primary" />,
      title: "Email",
      value: "ondoalex2020@gmail.com",
      href: "mailto:ondoalex2020@gmail.com",
      cta: "Envoyer un email",
    },
    {
      icon: <Linkedin className="w-6 h-6 text-primary" />,
      title: "LinkedIn",
      value: "linkedin.com/in/alex-ondo",
      href: "https://www.linkedin.com/in/alex-ondo-a5285920b",
      cta: "Voir le profil",
    },
    {
      icon: <Phone className="w-6 h-6 text-primary" />,
      title: "Téléphone",
      value: "07 68 80 08 85",
      href: "tel:+33768800885",
      cta: "Appeler",
    },
  ];

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter text-glow bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          {t.title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </div>

      <Card className="bg-secondary/30 p-2">
        <CardContent className="p-4">
          <ul className="space-y-6">
            {contactMethods.map((method, index) => (
              <li key={method.title}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {method.icon}
                    <div>
                      <h3 className="font-headline text-xl text-glow">{method.title}</h3>
                      <p className="text-muted-foreground">{method.value}</p>
                    </div>
                  </div>
                  <Button asChild className="shrink-0 w-full sm:w-auto">
                    <Link href={method.href} target="_blank">{method.cta}</Link>
                  </Button>
                </div>
                {index < contactMethods.length - 1 && <Separator className="mt-6" />}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      
       <div className="text-center p-4 border-t border-border/50 mt-12">
            <p className="text-muted-foreground">
                Pour une réponse instantanée, utilisez le chatbot en bas à droite !
            </p>
        </div>
    </div>
  );
}
