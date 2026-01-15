"use client";

import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { ContactForm } from "@/components/contact-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Mail, Phone, MapPin, Github, Linkedin, Instagram, Facebook, Code, Database, Palette, Globe, Server, Smartphone, Layout, GitBranch, Zap, Settings, BookOpen, Brain, ExternalLink, MessageCircle } from "lucide-react";
import Image from "next/image";
import { getPersonalInfo, getEducation, getExperiences, getCertifications, getWhatImDoing, getSkills, getProjects } from "@/lib/firestore";
import type { PersonalInfo, Education, Experience, Certification, WhatImDoing, Skill, Project } from "@/types/portfolio";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [whatImDoing, setWhatImDoing] = useState<WhatImDoing[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [prof, edu, exp, cert, whatDoing, skillsList, projectsList] = await Promise.all([
          getPersonalInfo(),
          getEducation(),
          getExperiences(),
          getCertifications(),
          getWhatImDoing(),
          getSkills(),
          getProjects(),
        ]);
        setProfile(prof);
        setEducation(edu.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate)));
        setExperience(exp.sort((a, b) => parseInt(b.startDate) - parseInt(a.startDate)));
        setCertifications(cert);
        setWhatImDoing(whatDoing);
        setSkills(skillsList);
        setProjects(projectsList);
      } catch (err) {
        console.error('Error loading portfolio:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    Code,
    Database,
    Palette,
    Globe,
    Server,
    Smartphone,
    Layout,
    GitBranch,
    Zap,
    Settings,
    BookOpen,
    Brain,
  };

  const roleBadges = useMemo(() => {
    const roles = new Set<string>();
    if (skills.length > 0) {
      skills.forEach(skill => roles.add(skill.name));
    } else {
      // Fallback if no skills are added
      if (profile?.title) roles.add(profile.title);
      experience.forEach((exp) => roles.add(exp.type));
    }
    return Array.from(roles);
  }, [skills, experience, profile?.title]);

  const formatPhoneForWhatsapp = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, "");
    if (cleaned.startsWith("+")) {
      return cleaned.substring(1);
    }
    if (cleaned.startsWith("0")) {
      return `62${cleaned.substring(1)}`;
    }
    return cleaned;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-10 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Skeleton */}
            <aside className="lg:col-span-3">
              <Card className="sticky top-6">
                <CardContent className="pt-6 space-y-6 flex flex-col items-center text-center">
                  <Skeleton className="h-[120px] w-[120px] rounded-lg" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-5 w-24 mx-auto" />
                  </div>
                  <Separator />
                  <div className="space-y-3 w-full">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="flex justify-center gap-3 w-full">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            </aside>

            {/* Content Skeleton */}
            <section className="lg:col-span-9">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <ThemeToggle />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Skeleton className="h-8 w-40" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex gap-4">
                          <Skeleton className="h-12 w-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-full" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4 space-y-3">
                        <div className="flex gap-4">
                          <Skeleton className="h-12 w-12 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-28" />
                            <Skeleton className="h-4 w-2/3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Kolom kiri */}
          <aside className="lg:col-span-3">
            <Card className="sticky top-6 overflow-hidden">
              <CardContent className="p-0">
                {/* Profile Header */}
                <div className="pt-8 pb-6 px-6 flex flex-col items-center text-center bg-gradient-to-b from-secondary/20 to-transparent">
                  <div className="mb-4">
                    {profile?.photoURL ? (
                      <Image 
                        src={profile.photoURL} 
                        alt="Profile" 
                        width={100} 
                        height={100} 
                        className="rounded-2xl ring-4 ring-background shadow-lg object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-[100px] h-[100px] rounded-2xl ring-4 ring-background shadow-lg bg-secondary/50 flex items-center justify-center">
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-xl font-bold mb-2">{profile?.name}</h1>
                  {profile?.title && (
                    <Badge variant="secondary" className="text-xs">{profile.title}</Badge>
                  )}
                </div>

                {/* Contact Info */}
                <div className="px-6 py-5 space-y-3">
                  {profile?.email && (
                    <a 
                      href={`mailto:${profile.email}`} 
                      className="flex items-start gap-3 text-sm group"
                    >
                      <Mail className="h-4 w-4 mt-0.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors break-all">{profile.email}</span>
                    </a>
                  )}
                  {profile?.phone && (
                    <div className="flex items-start gap-3 text-sm">
                      <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{profile.location}</span>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {profile?.socialLinks && (
                  <div className="px-6 pt-2">
                    <div className="flex justify-center gap-2 pt-3 border-t">
                      {profile.socialLinks.linkedin && (
                        <a 
                          href={profile.socialLinks.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.github && (
                        <a 
                          href={profile.socialLinks.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                          aria-label="GitHub"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.instagram && (
                        <a 
                          href={profile.socialLinks.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                          aria-label="Instagram"
                        >
                          <Instagram className="h-5 w-5" />
                        </a>
                      )}
                      {profile.socialLinks.facebook && (
                        <a 
                          href={profile.socialLinks.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </aside>

          {/* Kolom kanan */}
          <section className="lg:col-span-9">
            <Card className="relative">
              <CardHeader className="pb-0 mb-0">
              </CardHeader>
              <nav className="absolute top-0 right-0 flex flex-wrap gap-4 bg-neutral-50 dark:bg-neutral-800 backdrop-blur rounded-bl-lg rounded-tr-lg px-8 py-4 border-l border-b">
                {["about", "resume", "portfolio", "blog", "contact"].map((tab) => (
                  <Button
                    key={tab}
                    size="sm"
                    variant={activeTab === tab ? "default" : "outline"}
                    onClick={() => setActiveTab(tab as Tab)}
                    className="capitalize"
                  >
                    {tab}
                  </Button>
                ))}
                </nav>
              <CardContent className="space-y-4">
                {activeTab === "about" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-3xl font-semibold mb-6">About Me</h2>
                      <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{profile?.bio || "Belum ada deskripsi."}</p>
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold mb-6">What I'm Doing</h2>
                      {whatImDoing.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tambahkan di halaman admin untuk menampilkan.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {whatImDoing.map((item) => {
                            const IconComponent = ICON_MAP[item.icon] || Code;
                            return (
                              <Card key={item.id}>
                                <CardContent>
                                  <div className="flex gap-4">
                                    <div className="p-3 rounded-lg bg-secondary/50 h-fit">
                                      <IconComponent className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-semibold mb-1">{item.name}</h3>
                                      {item.description && (
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold mb-6">Skills</h2>
                      {skills.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Tambahkan skill di halaman admin untuk menampilkan.</p>
                      ) : (
                        <div className="space-y-4">
                          {skills.map((skill) => (
                            <div key={skill.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-secondary/20 transition-colors">
                              <div>
                                <p className="font-medium">{skill.name}</p>
                                {skill.description && <p className="text-sm text-muted-foreground">{skill.description}</p>}
                              </div>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">{skill.level}</Badge>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "resume" && (
                  <div className="space-y-12">
                    <div>
                      <h2 className="text-3xl font-semibold mb-6">Pengalaman</h2>
                      {experience.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada pengalaman.</p>
                      ) : (
                        <div className="space-y-4">
                          {experience.map((exp) => (
                            <div key={exp.id} className="space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center gap-2">
                                  {exp.logoURL && (
                                    <div className="relative w-8 h-8 flex-shrink-0">
                                      <Image
                                        src={exp.logoURL}
                                        alt={exp.organization}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                      />
                                    </div>
                                  )}
                                  <h3 className="font-semibold">{exp.title}</h3>
                                  <Badge variant="secondary" className="text-xs">{exp.type}</Badge>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">{formatMonthYear(exp.startDate)} - {formatMonthYear(exp.endDate)}</p>
                                </div>
                              </div>
                              <p className="text-sm">{exp.organization}{exp.location && <span className="text-muted-foreground"> – {exp.location}</span>}</p>
                              {exp.description && <p className="text-sm text-muted-foreground">{exp.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="text-3xl font-semibold mb-6">Pendidikan</h2>
                      {education.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Belum ada pendidikan.</p>
                      ) : (
                        <div className="space-y-4">
                          {education.map((edu) => (
                            <div key={edu.id} className="space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  {edu.certificateURL && (
                                    <div className="relative w-12 h-16 mb-2">
                                      <Image
                                        src={edu.certificateURL}
                                        alt={edu.institution}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                      />
                                    </div>
                                  )}
                                  <h3 className="font-semibold">{edu.fieldOfStudy}{edu.grade && `, IPK: ${edu.grade}`}</h3>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">{edu.startDate} – {edu.endDate}</p>
                                </div>
                              </div>
                              <p className="text-sm">{edu.institution}{edu.location && <span className="text-muted-foreground"> – {edu.location}</span>}</p>
                              {edu.description && <p className="text-sm text-muted-foreground">{edu.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "portfolio" && (
                  <div>
                    <h2 className="text-3xl font-semibold mb-6">Portfolio</h2>
                    {projects.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Belum ada proyek. Tambahkan proyek di halaman admin.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project) => (
                          <Card key={project.id} className="overflow-hidden">
                            {project.imageURL && (
                              <div className="relative w-full h-48">
                                <Image
                                  src={project.imageURL}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            )}
                            <CardContent className="pt-4">
                              <div className="space-y-3">
                                <div>
                                  <h3 className="font-semibold text-lg">{project.title}</h3>
                                  <Badge variant="secondary" className="text-xs mt-1">{project.category}</Badge>
                                </div>
                                {project.description && (
                                  <p className="text-sm text-muted-foreground">{project.description}</p>
                                )}
                                {project.tags && project.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, i) => (
                                      <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                    ))}
                                  </div>
                                )}
                                <div className="flex gap-3 pt-2">
                                  {project.projectURL && (
                                    <a
                                      href={project.projectURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                      Live Demo
                                    </a>
                                  )}
                                  {project.githubURL && (
                                    <a
                                      href={project.githubURL}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                      <Github className="h-4 w-4" />
                                      GitHub
                                    </a>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "blog" && (
                  <div>
                    <h2 className="text-3xl font-semibold mb-6">Blog</h2>
                    <p className="text-sm text-muted-foreground">Belum ada artikel. Tulis artikel singkat untuk ditampilkan di sini.</p>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="space-y-8">
                    <div>
                      <h2 className="text-3xl font-semibold mb-2">Get In Touch</h2>
                      <p className="text-muted-foreground">Saya terbuka untuk diskusi proyek, kolaborasi, atau sekadar ngobrol. Mari terhubung!</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Map & Info */}
                      <div className="space-y-6">
                        <div className="overflow-hidden rounded-xl border shadow-sm">
                          <iframe
                            title="Peta Kota Depok"
                            src="https://maps.google.com/maps?q=Depok%20City%2C%20West%20Java&z=12&output=embed"
                            width="100%"
                            height="280"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          />
                        </div>

                        {/* Quick Contact Info */}
                        <div className="space-y-3">
                          {profile?.email && (
                            <a
                              href={`mailto:${profile.email}`}
                              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all group"
                            >
                              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Mail className="h-4 w-4" />
                              </div>
                              <div className="flex-1 text-sm">
                                <p className="font-medium">Email</p>
                                <p className="text-muted-foreground">{profile.email}</p>
                              </div>
                            </a>
                          )}
                          {profile?.phone && (
                            <a
                              href={`https://wa.me/${formatPhoneForWhatsapp(profile.phone)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all group"
                            >
                              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <MessageCircle className="h-4 w-4" />
                              </div>
                              <div className="flex-1 text-sm">
                                <p className="font-medium">WhatsApp</p>
                                <p className="text-muted-foreground">{profile.phone}</p>
                              </div>
                            </a>
                          )}
                          {profile?.socialLinks?.linkedin && (
                            <a
                              href={profile.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-all group"
                            >
                              <div className="p-2 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Linkedin className="h-4 w-4" />
                              </div>
                              <div className="flex-1 text-sm">
                                <p className="font-medium">LinkedIn</p>
                                <p className="text-muted-foreground">Lihat profil profesional</p>
                              </div>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Contact Form */}
                      <div>
                        <ContactForm adminPhone={profile?.phone} />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      {/* Floating Theme Toggle */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}

