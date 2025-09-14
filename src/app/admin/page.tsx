"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardStats {
  revenue: {
    today: number;
    week: number;
    month: number;
    growth: number;
  };
  bookings: {
    active: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  occupancy: {
    current: number;
    capacity: number;
    percentage: number;
  };
  customers: {
    total: number;
    new: number;
    active: number;
  };
}

interface RecentActivity {
  id: string;
  type: "booking" | "payment" | "checkin" | "checkout";
  user: string;
  area: string;
  time: string;
  amount?: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  // Simulate real-time data
  useEffect(() => {
    const mockStats: DashboardStats = {
      revenue: {
        today: 2450000,
        week: 15200000,
        month: 58750000,
        growth: 12.5
      },
      bookings: {
        active: 23,
        pending: 5,
        completed: 156,
        cancelled: 3
      },
      occupancy: {
        current: 38,
        capacity: 50,
        percentage: 76
      },
      customers: {
        total: 1247,
        new: 23,
        active: 89
      }
    };

    const mockActivities: RecentActivity[] = [
      {
        id: "1",
        type: "booking",
        user: "Ahmad Wijaya",
        area: "Hot Desk A12",
        time: "2 menit lalu",
        amount: 50000
      },
      {
        id: "2",
        type: "checkin",
        user: "Sari Dewi",
        area: "Meeting Room B",
        time: "5 menit lalu"
      },
      {
        id: "3",
        type: "payment",
        user: "Budi Santoso",
        area: "Private Office C",
        time: "8 menit lalu",
        amount: 150000
      },
      {
        id: "4",
        type: "checkout",
        user: "Maya Sari",
        area: "Hot Desk A5",
        time: "12 menit lalu"
      }
    ];

    setStats(mockStats);
    setActivities(mockActivities);
  }, []);

  const toggleBusinessStatus = async () => {
    setIsOpen(!isOpen);
    // API call to update business status
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking": return "📅";
      case "payment": return "💳";
      case "checkin": return "🔓";
      case "checkout": return "🔒";
      default: return "ℹ️";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "booking": return "bg-blue-100 text-blue-800";
      case "payment": return "bg-green-100 text-green-800";
      case "checkin": return "bg-purple-100 text-purple-800";
      case "checkout": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di CODEN Admin Portal
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant={isOpen ? "default" : "secondary"} className="px-4 py-2">
            {isOpen ? "🟢 BUKA" : "🔴 TUTUP"}
          </Badge>
          <Button
            variant={isOpen ? "destructive" : "default"}
            onClick={toggleBusinessStatus}
          >
            {isOpen ? "Tutup Bisnis" : "Buka Bisnis"}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.today)}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.revenue.growth}% dari kemarin
            </p>
            <div className="mt-2 text-xs text-gray-600">
              Minggu: {formatCurrency(stats.revenue.week)}
            </div>
          </CardContent>
        </Card>

        {/* Active Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Booking Aktif</CardTitle>
            <span className="text-2xl">📅</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.bookings.pending} menunggu konfirmasi
            </p>
            <div className="mt-2 text-xs text-gray-600">
              Selesai: {stats.bookings.completed} | Batal: {stats.bookings.cancelled}
            </div>
          </CardContent>
        </Card>

        {/* Occupancy */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tingkat Hunian</CardTitle>
            <span className="text-2xl">🏢</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupancy.percentage}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.occupancy.current}/{stats.occupancy.capacity} meja terisi
            </p>
            <Progress value={stats.occupancy.percentage} className="mt-3" />
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pelanggan</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.customers.new} pelanggan baru
            </p>
            <div className="mt-2 text-xs text-gray-600">
              Aktif: {stats.customers.active} pelanggan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>
              Real-time aktivitas booking dan pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                      <span className="text-sm">{getActivityIcon(activity.type)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{activity.user}</div>
                      <div className="text-sm text-gray-600">{activity.area}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">{activity.time}</div>
                    {activity.amount && (
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(activity.amount)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Fungsi admin yang sering digunakan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">📊</span>
              Laporan Harian
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">👥</span>
              Kelola Customer
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">💳</span>
              Cek Pembayaran
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">🅿️</span>
              Monitor Parkir
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <span className="mr-2">💬</span>
              Moderasi Forum
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Metrik Performa</CardTitle>
          <CardDescription>Analisis bisnis minggu ini</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="revenue" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
              <TabsTrigger value="occupancy">Hunian</TabsTrigger>
              <TabsTrigger value="customers">Pelanggan</TabsTrigger>
              <TabsTrigger value="satisfaction">Kepuasan</TabsTrigger>
            </TabsList>
            
            <TabsContent value="revenue" className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(stats.revenue.week)}
                  </div>
                  <div className="text-sm text-gray-600">Minggu Ini</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(stats.revenue.month)}
                  </div>
                  <div className="text-sm text-gray-600">Bulan Ini</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">+{stats.revenue.growth}%</div>
                  <div className="text-sm text-gray-600">Pertumbuhan</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="occupancy">
              <div className="space-y-4">
                <Progress value={stats.occupancy.percentage} className="h-4" />
                <div className="text-center">
                  <div className="text-lg font-semibold">
                    {stats.occupancy.current} dari {stats.occupancy.capacity} meja terisi
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Rata-rata hunian: 68% minggu ini
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{stats.customers.new}</div>
                  <div className="text-sm text-gray-600">Pelanggan Baru</div>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <div className="text-2xl font-bold text-indigo-600">{stats.customers.active}</div>
                  <div className="text-sm text-gray-600">Aktif Minggu Ini</div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="satisfaction">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-yellow-600">4.8/5.0</div>
                <div className="text-gray-600">Rating kepuasan pelanggan</div>
                <div className="flex justify-center space-x-1">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}