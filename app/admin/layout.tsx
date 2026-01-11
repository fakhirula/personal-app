import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Home,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Admin CMS
            </Link>
            <Link href="/">
              <Button variant="outline" size="sm">
                View Portfolio
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Admin Sidebar */}
          <aside className="lg:col-span-1">
            <div className="space-y-2 sticky top-24">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant="ghost" className="w-full justify-start gap-2">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
