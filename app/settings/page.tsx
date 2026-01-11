import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Halaman ini akan berisi pengaturan aplikasi dan mode tampilan.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
