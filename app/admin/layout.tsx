'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
  Home,
  Zap,
  FolderKanban,
  LogOut,
} from 'lucide-react';
import { toast } from 'sonner';

const adminNavItems = [
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/education', label: 'Education', icon: GraduationCap },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/certifications', label: 'Certifications', icon: Award },
  { href: '/admin/skills', label: 'Skills', icon: Zap },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
];

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    const handleLogout = async () => {
      try {
        await logout();
        toast.success('Logout berhasil');
        router.push('/login');
      } catch (error) {
        toast.error('Logout gagal');
      }
    };

    if (loading) {
      return (
        <div className="min-h-screen bg-background">
          <nav className="border-b bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-28" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </nav>
          <div className="container mx-auto px-4 py-8">
            <div className="grid gap-6 lg:grid-cols-5">
              <aside className="lg:col-span-1 space-y-2">
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-full" />
              </aside>
              <section className="lg:col-span-4">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/6" />
                  </CardContent>
                </Card>
              </section>
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-lg font-bold flex items-center gap-2">
              <Home className="h-5 w-5" />
              Admin CMS
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Portfolio
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
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
