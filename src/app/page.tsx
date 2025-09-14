"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HomePage() {
  const [isOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CODEN</h1>
                <p className="text-sm text-gray-600">by Gutes</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant={isOpen ? "default" : "secondary"} className="px-3 py-1">
                {isOpen ? "🟢 BUKA" : "🔴 TUTUP"}
              </Badge>
              <div className="text-sm text-gray-600">
                {currentTime.toLocaleTimeString("id-ID")}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Ruang Kerja <span className="text-blue-600">Modern</span>
              <br />di <span className="text-green-600">Salatiga</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Platform manajemen co-working space terlengkap dengan sistem booking online, 
              pembayaran QRIS, dan akses internet otomatis untuk produktivitas maksimal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/customer">
                <Button size="lg" className="px-8 py-3 text-lg bg-blue-600 hover:bg-blue-700">
                  🏢 Booking Ruang Kerja
                </Button>
              </Link>
              <Link href="/admin/login">
                <Button variant="outline" size="lg" className="px-8 py-3 text-lg">
                  🔐 Admin Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Fitur Unggulan CODEN</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sistem terintegrasi untuk kemudahan booking, pembayaran, dan pengelolaan co-working space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Customer Features */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                Booking Online
              </CardTitle>
              <CardDescription>Sistem reservasi digital</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ Cek ketersediaan real-time</div>
              <div className="text-sm text-gray-600">✓ Pilih durasi custom</div>
              <div className="text-sm text-gray-600">✓ Pembayaran QRIS instan</div>
              <div className="text-sm text-gray-600">✓ Kode check-in WhatsApp</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💳</span>
                Pembayaran QRIS
              </CardTitle>
              <CardDescription>Integrasi Xendit payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ QRIS scan & pay</div>
              <div className="text-sm text-gray-600">✓ Konfirmasi otomatis</div>
              <div className="text-sm text-gray-600">✓ Riwayat pembayaran</div>
              <div className="text-sm text-gray-600">✓ Top-up perpanjangan</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🌐</span>
                Internet Otomatis
              </CardTitle>
              <CardDescription>Mikrotik integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ Username/password auto</div>
              <div className="text-sm text-gray-600">✓ Kontrol bandwidth</div>
              <div className="text-sm text-gray-600">✓ Monitoring usage</div>
              <div className="text-sm text-gray-600">✓ Auto disconnect</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">💬</span>
                WhatsApp Notifikasi
              </CardTitle>
              <CardDescription>Fonnte API integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ Kode check-in otomatis</div>
              <div className="text-sm text-gray-600">✓ Reminder pembayaran</div>
              <div className="text-sm text-gray-600">✓ Info internet access</div>
              <div className="text-sm text-gray-600">✓ Thank you message</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">🅿️</span>
                Parking System
              </CardTitle>
              <CardDescription>Manajemen parkir terintegrasi</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ Booking parkir online</div>
              <div className="text-sm text-gray-600">✓ Self-parking & valet</div>
              <div className="text-sm text-gray-600">✓ Kategori kendaraan</div>
              <div className="text-sm text-gray-600">✓ Attendant management</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="text-2xl">👥</span>
                Community Forum
              </CardTitle>
              <CardDescription>Platform diskusi member</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-gray-600">✓ Sharing artikel & blog</div>
              <div className="text-sm text-gray-600">✓ Diskusi topik bisnis</div>
              <div className="text-sm text-gray-600">✓ Upload gambar/video</div>
              <div className="text-sm text-gray-600">✓ Moderasi konten</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Akses Online</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Meja Kerja</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Digital Payment</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">5⭐</div>
              <div className="text-gray-600">Rating Member</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CODEN by Gutes</h3>
              <p className="text-gray-400 mb-4">
                Co-working space modern di jantung Salatiga, Jawa Tengah. 
                Tempat terbaik untuk produktivitas dan networking.
              </p>
              <div className="text-gray-400">
                📍 Salatiga, Central Java, Indonesia
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <div className="space-y-2 text-gray-400">
                <div>• Booking Ruang Kerja</div>
                <div>• Internet High Speed</div>
                <div>• Parking Management</div>
                <div>• F&B Service</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <div className="space-y-2 text-gray-400">
                <div>📱 WhatsApp: +62-xxx-xxx-xxxx</div>
                <div>✉️ Email: info@coden.gutes.id</div>
                <div>🌐 Website: coden.gutes.id</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CODEN by Gutes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}