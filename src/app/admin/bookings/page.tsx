"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Booking {
  id: string;
  checkInCode: string;
  customer: {
    name: string;
    whatsapp: string;
  };
  area: {
    name: string;
    type: string;
  };
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "PARTIAL" | "REFUNDED" | "FAILED";
  internetAccess: boolean;
  internetCredentials?: {
    username: string;
    password: string;
  };
  addOns?: any[];
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Mock data
  useEffect(() => {
    const mockBookings: Booking[] = [
      {
        id: "1",
        checkInCode: "CODEN001",
        customer: {
          name: "Ahmad Wijaya",
          whatsapp: "628123456789"
        },
        area: {
          name: "Hot Desk Area A",
          type: "HOT_DESK"
        },
        startTime: "2024-01-15T09:00:00Z",
        endTime: "2024-01-15T13:00:00Z",
        duration: 240,
        totalAmount: 100000,
        status: "ACTIVE",
        paymentStatus: "PAID",
        internetAccess: true,
        internetCredentials: {
          username: "user001",
          password: "pass123"
        },
        addOns: [
          { name: "Kopi Latte", quantity: 1, price: 15000 }
        ]
      },
      {
        id: "2",
        checkInCode: "CODEN002",
        customer: {
          name: "Sari Dewi",
          whatsapp: "628987654321"
        },
        area: {
          name: "Meeting Room B",
          type: "MEETING_ROOM"
        },
        startTime: "2024-01-15T14:00:00Z",
        endTime: "2024-01-15T16:00:00Z",
        duration: 120,
        totalAmount: 200000,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        internetAccess: false
      },
      {
        id: "3",
        checkInCode: "CODEN003",
        customer: {
          name: "Budi Santoso",
          whatsapp: "628555666777"
        },
        area: {
          name: "Private Office C",
          type: "PRIVATE_OFFICE"
        },
        startTime: "2024-01-15T10:00:00Z",
        endTime: "2024-01-15T18:00:00Z",
        duration: 480,
        totalAmount: 600000,
        status: "CHECKED_IN",
        paymentStatus: "PAID",
        internetAccess: true,
        internetCredentials: {
          username: "user003",
          password: "pass456"
        }
      }
    ];

    setBookings(mockBookings);
    setFilteredBookings(mockBookings);
  }, []);

  // Filter bookings
  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.checkInCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.area.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchTerm, statusFilter]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(dateString));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Menunggu", color: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Dikonfirmasi", color: "bg-blue-100 text-blue-800" },
      CHECKED_IN: { label: "Check-in", color: "bg-purple-100 text-purple-800" },
      ACTIVE: { label: "Aktif", color: "bg-green-100 text-green-800" },
      COMPLETED: { label: "Selesai", color: "bg-gray-100 text-gray-800" },
      CANCELLED: { label: "Dibatalkan", color: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "Pending", color: "bg-orange-100 text-orange-800" },
      PAID: { label: "Lunas", color: "bg-green-100 text-green-800" },
      PARTIAL: { label: "Sebagian", color: "bg-yellow-100 text-yellow-800" },
      REFUNDED: { label: "Dikembalikan", color: "bg-blue-100 text-blue-800" },
      FAILED: { label: "Gagal", color: "bg-red-100 text-red-800" }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge className={`${config.color} border-0`}>
        {config.label}
      </Badge>
    );
  };

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    // API call to update booking status
    setBookings(prev => prev.map(booking =>
      booking.id === bookingId
        ? { ...booking, status: newStatus as any }
        : booking
    ));
  };

  const handleInternetControl = async (bookingId: string, action: "connect" | "disconnect") => {
    // API call to Mikrotik to control internet access
    console.log(`${action} internet for booking ${bookingId}`);
  };

  const sendWhatsAppNotification = async (booking: Booking, type: "checkin" | "credentials" | "reminder") => {
    // API call to Fonnte WhatsApp service
    console.log(`Sending ${type} notification to ${booking.customer.whatsapp}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manajemen Booking</h1>
          <p className="text-gray-600 mt-1">
            Kelola reservasi dan check-in customer
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter & Pencarian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Cari nama customer, kode booking, atau area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Menunggu</SelectItem>
                <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                <SelectItem value="ACTIVE">Aktif</SelectItem>
                <SelectItem value="COMPLETED">Selesai</SelectItem>
                <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Booking ({filteredBookings.length})</CardTitle>
          <CardDescription>
            Klik pada booking untuk melihat detail dan mengelola akses internet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kode</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Durasi</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Pembayaran</TableHead>
                  <TableHead>Internet</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono font-medium">
                      {booking.checkInCode}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{booking.customer.name}</div>
                        <div className="text-sm text-gray-500">{booking.customer.whatsapp}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.area.name}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDateTime(booking.startTime)}</div>
                        <div className="text-gray-500">s/d {formatDateTime(booking.endTime)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{booking.duration} menit</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(booking.totalAmount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{getPaymentStatusBadge(booking.paymentStatus)}</TableCell>
                    <TableCell>
                      <Badge variant={booking.internetAccess ? "default" : "secondary"}>
                        {booking.internetAccess ? "🟢 Aktif" : "🔴 Nonaktif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            Kelola
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detail Booking - {booking.checkInCode}</DialogTitle>
                            <DialogDescription>
                              Kelola status booking dan akses internet customer
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBooking && (
                            <Tabs defaultValue="details" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="details">Detail</TabsTrigger>
                                <TabsTrigger value="internet">Internet</TabsTrigger>
                                <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="details" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Customer</label>
                                    <div className="mt-1 text-sm">
                                      <div>{selectedBooking.customer.name}</div>
                                      <div className="text-gray-500">{selectedBooking.customer.whatsapp}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Area</label>
                                    <div className="mt-1 text-sm">{selectedBooking.area.name}</div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status Booking</label>
                                    <Select
                                      value={selectedBooking.status}
                                      onValueChange={(value) => handleUpdateStatus(selectedBooking.id, value)}
                                    >
                                      <SelectTrigger className="mt-1">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="PENDING">Menunggu</SelectItem>
                                        <SelectItem value="CONFIRMED">Dikonfirmasi</SelectItem>
                                        <SelectItem value="CHECKED_IN">Check-in</SelectItem>
                                        <SelectItem value="ACTIVE">Aktif</SelectItem>
                                        <SelectItem value="COMPLETED">Selesai</SelectItem>
                                        <SelectItem value="CANCELLED">Dibatalkan</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status Pembayaran</label>
                                    <div className="mt-1">{getPaymentStatusBadge(selectedBooking.paymentStatus)}</div>
                                  </div>
                                </div>
                                
                                {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">Add-ons</label>
                                    <div className="mt-1 space-y-1">
                                      {selectedBooking.addOns.map((addon, index) => (
                                        <div key={index} className="text-sm flex justify-between">
                                          <span>{addon.name} x{addon.quantity}</span>
                                          <span>{formatCurrency(addon.price)}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="internet" className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Status Internet</span>
                                    <Badge variant={selectedBooking.internetAccess ? "default" : "secondary"}>
                                      {selectedBooking.internetAccess ? "🟢 Aktif" : "🔴 Nonaktif"}
                                    </Badge>
                                  </div>
                                  
                                  {selectedBooking.internetCredentials && (
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="text-gray-600">Username:</span>
                                        <div className="font-mono bg-white p-2 rounded mt-1">
                                          {selectedBooking.internetCredentials.username}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="text-gray-600">Password:</span>
                                        <div className="font-mono bg-white p-2 rounded mt-1">
                                          {selectedBooking.internetCredentials.password}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleInternetControl(selectedBooking.id, "connect")}
                                    disabled={selectedBooking.internetAccess}
                                    size="sm"
                                  >
                                    🔓 Aktifkan Internet
                                  </Button>
                                  <Button
                                    onClick={() => handleInternetControl(selectedBooking.id, "disconnect")}
                                    disabled={!selectedBooking.internetAccess}
                                    variant="destructive"
                                    size="sm"
                                  >
                                    🔒 Putuskan Internet
                                  </Button>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="notifications" className="space-y-4">
                                <div className="space-y-3">
                                  <Button
                                    onClick={() => sendWhatsAppNotification(selectedBooking, "checkin")}
                                    variant="outline"
                                    className="w-full justify-start"
                                  >
                                    📱 Kirim Kode Check-in
                                  </Button>
                                  <Button
                                    onClick={() => sendWhatsAppNotification(selectedBooking, "credentials")}
                                    variant="outline"
                                    className="w-full justify-start"
                                  >
                                    🔐 Kirim Info Internet
                                  </Button>
                                  <Button
                                    onClick={() => sendWhatsAppNotification(selectedBooking, "reminder")}
                                    variant="outline"
                                    className="w-full justify-start"
                                  >
                                    ⏰ Kirim Reminder
                                  </Button>
                                </div>
                                
                                <div className="text-sm text-gray-600">
                                  <p>Notifikasi akan dikirim ke WhatsApp: {selectedBooking.customer.whatsapp}</p>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredBookings.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada booking ditemukan
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}