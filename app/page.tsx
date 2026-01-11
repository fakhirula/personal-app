"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook } from "lucide-react";
import { getPersonalInfo, getEducation, getExperiences, getCertifications } from "@/lib/firestore";
import type { PersonalInfo, Education, Experience, Certification } from "@/types/portfolio";

const formatMonthYear = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

type Tab = "about" | "resume" | "portfolio" | "blog" | "contact";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("about");
  const [profile, setProfile] = useState<PersonalInfo | null>(null);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prof, edu, exp, cert] = await Promise.all([
          getPersonalInfo(),
          getEducation(),
          getExperiences(),
          getCertifications(),
        ]);
        setProfile(prof);
        setEducation(edu.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate)));
        setExperience(exp.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate)));
        setCertifications(cert);
      } catch (err) {
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const roleBadges = useMemo(() => {
    const roles = new Set<string>();
    if (profile?.title) roles.add(profile.title);
    experience.forEach((exp) => roles.add(exp.type));
    return Array.from(roles);
  }, [experience, profile?.title]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom kiri */}
          <aside className="lg:col-span-3">
            <Card className="sticky top-6">
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile?.photoURL} />
                    <AvatarFallback>{profile?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-xl font-bold leading-tight">{profile?.name}</h1>
                    <p className="text-sm text-muted-foreground">{profile?.title}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  {profile?.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${profile.email}`} className="hover:text-primary">{profile.email}</a>
                    </div>
                  )}
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                </div>

                {profile?.socialLinks && (
                  <div className="flex flex-wrap gap-3">
                    {profile.socialLinks.linkedin && (
                      <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-primary">
                        <Linkedin className="h-4 w-4" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                    {profile.socialLinks.instagram && (
                      <a href={profile.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-primary">
                        <Instagram className="h-4 w-4" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {profile.socialLinks.github && (
                      <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-primary">
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                    {profile.socialLinks.facebook && (
                      <a href={profile.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:border-primary">
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Kolom kanan */}
          <section className="lg:col-span-9 space-y-6">
            <nav className="flex flex-wrap gap-3">
              {["about", "resume", "portfolio", "blog", "contact"].map((tab) => (
                <Button
                  key={tab}
                  variant={activeTab === tab ? "default" : "outline"}
                  onClick={() => setActiveTab(tab as Tab)}
                  className="capitalize"
                >
                  {tab}
                </Button>
              ))}
            </nav>

            {activeTab === "about" && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed text-muted-foreground">{profile?.bio || "Belum ada deskripsi."}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What I'm Doing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {roleBadges.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Tambahkan pengalaman atau jabatan untuk menampilkan peran.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {roleBadges.map((role) => (
                          <Badge key={role} variant="secondary">{role}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "resume" && (
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pengalaman</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experience.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Belum ada pengalaman.</p>
                    ) : (
                      experience.map((exp) => (
                        <div key={exp.id} className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold">{exp.title}</h3>
                            <Badge variant="secondary">{exp.type}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}</p>
                          <p className="text-sm">{exp.organization}{exp.location && ` – ${exp.location}`}</p>
                          {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Pendidikan</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {education.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Belum ada pendidikan.</p>
                    ) : (
                      education.map((edu) => (
                        <div key={edu.id} className="space-y-1">
                          <h3 className="font-semibold">{edu.level} – {edu.fieldOfStudy}{edu.grade && `, IPK: ${edu.grade}`}</h3>
                          <p className="text-sm text-muted-foreground">{edu.startDate} – {edu.endDate}</p>
                          <p className="text-sm">{edu.institution}{edu.location && ` – ${edu.location}`}</p>
                          {edu.description && <p className="text-sm text-muted-foreground">{edu.description}</p>}
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "portfolio" && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Belum ada proyek. Tambahkan proyek beserta dokumentasi dan tautan.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "blog" && (
              <Card>
                <CardHeader>
                  <CardTitle>Blog</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Belum ada artikel. Tulis artikel singkat untuk ditampilkan di sini.</p>
                </CardContent>
              </Card>
            )}

            {activeTab === "contact" && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>Terbuka untuk diskusi proyek atau kolaborasi. Silakan hubungi melalui informasi di samping.</p>
                  {profile?.email && <p>Email: {profile.email}</p>}
                  {profile?.phone && <p>Phone: {profile.phone}</p>}
                  {profile?.location && <p>Alamat: {profile.location}</p>}
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
