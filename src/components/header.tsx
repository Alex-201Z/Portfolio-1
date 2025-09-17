
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Code2, Menu, X, LogIn, LogOut, Settings } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { LanguageSwitcher } from "./language-switcher";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle, SheetDescription } from "./ui/sheet";
import { useAuth } from "@/hooks/use-auth";
import { Separator } from "./ui/separator";

const navItems = [
  { nameKey: "home", href: "/" },
  { nameKey: "projects", href: "/projects" },
  { nameKey: "skills", href: "/skills" },
  { nameKey: "parcours", href: "/parcours" },
  { nameKey: "contact", href: "/contact" },
  { nameKey: "gamer", href: "/gamer" },
];

const adminNavItems = [
    { nameKey: "portfolioManagement", href: "/admin/projects" },
    { nameKey: "skillsManagement", href: "/admin/skills" },
    { nameKey: "ideaGenerator", href: "/idea-generator" }
]

export function Header({ dictionary }: { dictionary: any }) { 
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();
  
  const lang = pathname.split('/')[1] || 'fr';

  const getLocalizedPath = (path: string) => {
    if (path === "/") return `/${lang}`;
    return `/${lang}${path}`;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push(getLocalizedPath('/'));
    router.refresh();
  };

  const renderNavLinks = (items: {nameKey: string, href: string}[], isMobile = false) => {
    return items.map((item) => {
      const localizedHref = getLocalizedPath(item.href);
      const isActive = item.href === "/" 
        ? pathname === localizedHref
        : pathname.startsWith(localizedHref);
      
      const linkContent = (
        <>
          {dictionary[item.nameKey] || item.nameKey}
          {isActive && !isMobile && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary text-glow"></span>
          )}
        </>
      );

      const className = cn(
        "relative text-foreground/70 transition-colors hover:text-primary",
        isActive && "text-primary",
        isMobile && "text-lg py-2"
      )

      if (isMobile) {
        return (
          <SheetClose asChild key={item.nameKey}>
            <Link href={localizedHref} className={className}>
              {linkContent}
            </Link>
          </SheetClose>
        )
      }
      
      return (
        <Link key={item.nameKey} href={localizedHref} className={className}>
          {linkContent}
        </Link>
      );
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/50 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href={getLocalizedPath("/")} className="flex items-center gap-2">
          <Code2 className="h-7 w-7 text-primary text-glow" />
          <span className="font-headline text-xl font-bold">Alex Ondo</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {renderNavLinks(navItems)}
          {user && (
            <>
              <div className="h-6 border-l border-border/50"></div>
              {renderNavLinks(adminNavItems)}
            </>
          )}
        </nav>
        <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <LanguageSwitcher />
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={handleSignOut}>
                        <LogOut className="h-[1.2rem] w-[1.2rem]" />
                        <span className="sr-only">Déconnexion</span>
                    </Button>
                  </div>
                ) : (
                  <Button variant="ghost" size="icon" asChild className="hidden md:inline-flex">
                    <Link href={getLocalizedPath("/login")}>
                      <LogIn className="h-[1.2rem] w-[1.2rem]" />
                      <span className="sr-only">Connexion</span>
                    </Link>
                  </Button>
                )}
              </>
            )}
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Ouvrir le menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                   <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                   <SheetDescription className="sr-only">
                     Liens principaux pour naviguer sur le site.
                   </SheetDescription>
                   <div className="flex flex-col items-start gap-6 p-4">
                      <SheetClose asChild>
                        <Link href={getLocalizedPath("/")} className="flex items-center gap-2 mb-4">
                            <Code2 className="h-7 w-7 text-primary text-glow" />
                            <span className="font-headline text-xl font-bold">Alex Ondo</span>
                        </Link>
                      </SheetClose>
                      <nav className="flex flex-col gap-4 text-left">
                        {renderNavLinks(navItems, true)}
                      </nav>
                      <div className="border-t border-border/50 pt-4 w-full">
                         {!loading && (
                            user ? (
                                <div className="flex flex-col gap-4 text-left">
                                    <h3 className="text-muted-foreground text-sm font-semibold">Admin</h3>
                                    {renderNavLinks(adminNavItems, true)}
                                    <SheetClose asChild>
                                        <Button variant="ghost" onClick={handleSignOut} className="justify-start p-0 text-lg py-2 h-auto text-foreground/70">
                                            Déconnexion
                                        </Button>
                                    </SheetClose>
                                </div>
                            ) : (
                                <SheetClose asChild>
                                    <Link href={getLocalizedPath("/login")} className="text-lg py-2 text-foreground/70">
                                        Connexion
                                    </Link>
                                </SheetClose>
                            )
                         )}
                      </div>
                   </div>
                </SheetContent>
              </Sheet>
            </div>
        </div>
      </div>
    </header>
  );
}
