import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  User,
  GraduationCap,
  Briefcase,
  Award,
} from 'lucide-react';

export default function AdminPage() {
  const sections = [
    {
      icon: User,
      title: 'Profile',
      description: 'Kelola informasi profil pribadi dan foto',
      href: '/admin/profile',
    },
    {
      icon: GraduationCap,
      title: 'Education',
      description: 'Kelola riwayat pendidikan',
      href: '/admin/education',
    },
    {
      icon: Briefcase,
      title: 'Experience',
      description: 'Kelola pengalaman kerja, magang, dan organisasi',
      href: '/admin/experience',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Kelola sertifikasi dan penghargaan',
      href: '/admin/certifications',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">Kelola semua data portofolio Anda</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-primary" />
                  <CardTitle>{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{section.description}</p>
                <Link href={section.href}>
                  <Button className="w-full">Kelola</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
