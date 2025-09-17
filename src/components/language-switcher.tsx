"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { usePathname, useRouter } from "next/navigation"

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  
  const currentLang = pathname.split('/')[1] || 'fr';

  const onValueChange = (value: string) => {
    const newPath = `/${value}${pathname.substring(3)}`;
    router.push(newPath);
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={currentLang}>
      <SelectTrigger className="w-[80px]">
        <SelectValue placeholder="Langue" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="fr">FR</SelectItem>
        <SelectItem value="en">EN</SelectItem>
      </SelectContent>
    </Select>
  );
}
