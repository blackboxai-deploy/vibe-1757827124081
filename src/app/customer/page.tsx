"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

interface Area {
  id: string;
  name: string;
  description: string;
  capacity: number;
  available: number;
  images: string[];
  amenities: string[];
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  isAvailable: boolean;
}

interface ParkingSlot {
  id: string;
  area: string;
  type: "MOTORCYCLE" | "CAR";
  available: number;
  total: number;
}

export default function CustomerPortal() {
  const [areas, setAreas] = useState<Area[]>([]);
  const [parking, setParking] = useState<ParkingSlot[]>([]);
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [selectedArea, setSelectedArea] = useState<Area | null>(null);
  const [bookingDuration, setBookingDuration] = useState("4");
  const [pricingType, setPricingType] = useState("hourly");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data - replace with real API calls
  useEffect(() => {
    const mockAreas: Area[] = [
      {
        id: "1",
        name: "Hot Desk Area A",
        description: "Area kerja terbuka dengan akses internet high-speed",
        capacity: 20,
        available: 12,
        images: ["https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/169ab6d5-10e1-455e-98cd-e4030d7dc830.png"],
        amenities: ["High Speed WiFi", "Power Outlet", "AC", "Natural Light"],
        pricing: {
          hourly: 25000,
          daily: 150000,
          weekly: 800000,
          monthly: 2500000
        },
        isAvailable: true
      },
      {
        id: "2", 
        name: "Private Office B",
        description: "Ruang kerja pribadi untuk produktivitas maksimal",
        capacity: 4,
        available: 2,
        images: ["https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/77a42368-18e2-4e97-8af0-19ced1ead8a1.png"],
        amenities: ["Private Space", "WiFi", "AC", "Meeting Table", "Whiteboard"],
        pricing: {
          hourly: 75000,
          daily: 450000,
          weekly: 2100000,
          monthly: 6000000
        },
        isAvailable: true
      },
      {
        id: "3",
        name: "Meeting Room C",
        description: "Ruang meeting dengan fasilitas presentasi",
        capacity: 8,
        available: 0,
        images: ["https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0d541b45-4851-45d5-a2c2-4108b208afb3.png"],
        amenities: ["Projector", "Whiteboard", "WiFi", "AC", "Sound System"],
        pricing: {
          hourly: 100000,
          daily: 600000,
          weekly: 2800000,
          monthly: 8000000
        },
        isAvailable: false
      }
    ];

    const mockParking: ParkingSlot[] = [
      {
        id: "1",
        area: "Indoor Parking",
        type: "MOTORCYCLE",
        available: 25,
        total: 30
      },
      {
        id: "2",
        area: "Indoor Parking",
        type: "CAR",
        available: 8,
        total: 15
      },
      {
        id: "3",
        area: "Outdoor Parking",
        type: "MOTORCYCLE",
        available: 40,
        total: 50
      }
    ];

    setAreas(mockAreas);
    setParking(mockParking);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency", 
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const calculatePrice = (area: Area) => {
    const duration = parseInt(bookingDuration);
    switch (pricingType) {
      case "hourly":
        return area.pricing.hourly * duration;
      case "daily":
        return area.pricing.daily * Math.ceil(duration / 8);
      case "weekly":
        return area.pricing.weekly * Math.ceil(duration / 40);
      case "monthly":
        return area.pricing.monthly * Math.ceil(duration / 160);
      default:
        return area.pricing.hourly * duration;
    }
  };

  const handleBooking = async () => {
    if (!whatsappNumber) {
      alert("Silakan masukkan nomor WhatsApp terlebih dahulu");
      return;
    }

    setIsLoading(true);
    
    // Simulate booking API call
    setTimeout(() => {
      setIsLoading(false);
      alert(`Booking berhasil! Kode check-in akan dikirim ke WhatsApp ${whatsappNumber}`);
      setSelectedArea(null);
    }, 2000);
  };

  const contactCustomerExperience = () => {
    const message = encodeURIComponent("Halo, saya ingin bertanya tentang booking ruang kerja di CODEN");
    window.open(`https://wa.me/628123456789?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CODEN</h1>
                <p className="text-sm text-gray-600">Customer Portal</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge className="px-3 py-1 bg-green-600">
                🟢 BUKA
              </Badge>
              <Button
                onClick={contactCustomerExperience}
                variant="outline"
                size="sm"
              >
                💬 Chat CEx
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Login Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              Akses Customer
            </CardTitle>
            <CardDescription>
              Masukkan nomor WhatsApp untuk mulai booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="628123456789"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button disabled={!whatsappNumber}>
                Verifikasi
              </Button>
            </div>
            {whatsappNumber && (
              <div className="mt-2 text-sm text-green-600">
                ✅ Siap untuk booking dengan WhatsApp: {whatsappNumber}
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="areas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="areas">🏢 Area Kerja</TabsTrigger>
            <TabsTrigger value="parking">🅿️ Parkir</TabsTrigger>
            <TabsTrigger value="forum">💬 Forum</TabsTrigger>
          </TabsList>

          {/* Areas Tab */}
          <TabsContent value="areas" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {areas.map((area) => (
                <Card key={area.id} className={`${area.isAvailable ? 'hover:shadow-lg' : 'opacity-75'} transition-shadow`}>
                  <CardHeader>
                    <div className="relative">
                      <img
                        src={area.images[0]}
                        alt={area.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <Badge 
                        className={`absolute top-2 right-2 ${
                          area.isAvailable ? 'bg-green-600' : 'bg-red-600'
                        }`}
                      >
                        {area.available > 0 ? `${area.available} tersedia` : 'Penuh'}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{area.name}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Kapasitas:</span>
                      <span>{area.capacity} orang</span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Fasilitas:</div>
                      <div className="flex flex-wrap gap-1">
                        {area.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-sm font-medium">Harga:</div>
                      <div className="text-xs space-y-1">
                        <div>Per Jam: {formatCurrency(area.pricing.hourly)}</div>
                        <div>Per Hari: {formatCurrency(area.pricing.daily)}</div>
                        <div>Per Minggu: {formatCurrency(area.pricing.weekly)}</div>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full" 
                          disabled={!area.isAvailable || !whatsappNumber}
                          onClick={() => setSelectedArea(area)}
                        >
                          {area.isAvailable ? 'Booking Sekarang' : 'Tidak Tersedia'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Booking {selectedArea?.name}</DialogTitle>
                          <DialogDescription>
                            Atur durasi dan konfirmasi booking Anda
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedArea && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="duration">Durasi</Label>
                                <Input
                                  id="duration"
                                  type="number"
                                  min="1"
                                  max="24"
                                  value={bookingDuration}
                                  onChange={(e) => setBookingDuration(e.target.value)}
                                />
                              </div>
                              <div>
                                <Label htmlFor="pricing-type">Tipe Harga</Label>
                                <Select value={pricingType} onValueChange={setPricingType}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="hourly">Per Jam</SelectItem>
                                    <SelectItem value="daily">Per Hari</SelectItem>
                                    <SelectItem value="weekly">Per Minggu</SelectItem>
                                    <SelectItem value="monthly">Per Bulan</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Total Harga:</span>
                                <span className="text-xl font-bold text-blue-600">
                                  {formatCurrency(calculatePrice(selectedArea))}
                                </span>
                              </div>
                            </div>

                            <Button 
                              onClick={() => handleBooking()}
                              className="w-full"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center space-x-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Processing...</span>
                                </div>
                              ) : (
                                'Konfirmasi Booking'
                              )}
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Parking Tab */}
          <TabsContent value="parking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parking.map((slot) => (
                <Card key={slot.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">
                        {slot.type === 'MOTORCYCLE' ? '🏍️' : '🚗'}
                      </span>
                      {slot.area}
                    </CardTitle>
                    <CardDescription>
                      {slot.type === 'MOTORCYCLE' ? 'Parkir Motor' : 'Parkir Mobil'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Tersedia:</span>
                        <span className="font-bold text-green-600">
                          {slot.available}/{slot.total}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${(slot.available / slot.total) * 100}%` }}
                        ></div>
                      </div>

                      <Button 
                        className="w-full" 
                        variant="outline"
                        disabled={slot.available === 0 || !whatsappNumber}
                      >
                        {slot.available > 0 ? 'Booking Parkir' : 'Parkir Penuh'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Forum Komunitas CODEN</CardTitle>
                <CardDescription>
                  Bergabung dengan komunitas co-worker CODEN untuk berbagi informasi dan networking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">📝 Artikel & Blog</h3>
                      <p className="text-sm text-gray-600">Bagikan artikel, tips produktivitas, dan pengalaman kerja</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">💼 Diskusi Bisnis</h3>
                      <p className="text-sm text-gray-600">Forum diskusi untuk networking dan kolaborasi</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">📷 Galeri Komunitas</h3>
                      <p className="text-sm text-gray-600">Bagikan foto dan video kegiatan di CODEN</p>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-2">❓ Q&A Session</h3>
                      <p className="text-sm text-gray-600">Tanya jawab seputar fasilitas dan layanan</p>
                    </div>
                  </div>
                  
                  <div className="text-center pt-4">
                    <Button size="lg" disabled={!whatsappNumber}>
                      🚀 Akses Forum Komunitas
                    </Button>
                    {!whatsappNumber && (
                      <p className="text-sm text-gray-500 mt-2">
                        Login dengan WhatsApp untuk mengakses forum
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}