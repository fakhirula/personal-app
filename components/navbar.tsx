'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Settings,
  Home,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/education', label: 'Education', icon: GraduationCap },
  { href: '/experience', label: 'Experience', icon: Briefcase },
  { href: '/certifications', label: 'Certifications', icon: Award },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface NavbarProps {
  currentMode?: string;
}

export function Navbar({ currentMode = 'full' }: NavbarProps) {
  const pathname = usePathname();

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-xl font-bold">
              Personal Portfolio
            </Link>
            <Badge variant="outline" className="hidden sm:flex">
              {currentMode}
            </Badge>
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
