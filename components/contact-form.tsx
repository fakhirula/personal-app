'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { addContactMessage } from '@/lib/firestore';
import { toast } from 'sonner';
import { Mail, Phone, MessageCircle, Send } from 'lucide-react';

interface ContactFormProps {
  adminPhone?: string;
}

export function ContactForm({ adminPhone }: ContactFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const formatPhoneForWhatsapp = (phone: string) => {
    const cleaned = phone.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+')) return cleaned.substring(1);
    if (cleaned.startsWith('0')) return `62${cleaned.substring(1)}`;
    return cleaned;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Save to Firestore
      await addContactMessage({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        timestamp: new Date().toISOString(),
        isRead: false,
      });

      toast.success('Pesan terkirim! Mengalihkan ke WhatsApp...');

      // Build WhatsApp message
      const waMessage = `Halo, saya ${form.name}%0A%0AEmail: ${form.email}${
        form.phone ? `%0ATelp: ${form.phone}` : ''
      }%0A%0APesan:%0A${encodeURIComponent(form.message)}`;

      // Redirect to WhatsApp
      if (adminPhone) {
        const waNumber = formatPhoneForWhatsapp(adminPhone);
        window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
      }

      // Reset form
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Gagal mengirim pesan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nama <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Nama lengkap Anda"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                className="pl-10"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telepon (Opsional)</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="08xxxxxxxxxx"
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Pesan <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tulis pesan Anda di sini..."
              rows={5}
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              'Mengirim...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Kirim Pesan
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Pesan akan tersimpan dan Anda akan dialihkan ke WhatsApp
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
