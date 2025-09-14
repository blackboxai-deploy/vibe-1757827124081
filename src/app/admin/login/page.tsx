"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/components/providers/auth-provider";

export default function AdminLogin() {
  const [employeeId, setEmployeeId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleEmployeeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const success = await login({ employeeId, password });
      if (success) {
        router.push("/admin");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await loginWithGoogle();
    } catch (err) {
      setError("Terjadi kesalahan saat login dengan Google");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <div>
            <CardTitle className="text-2xl">CODEN Admin Portal</CardTitle>
            <CardDescription>
              Masuk ke sistem manajemen co-working space
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="employee" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="employee">Employee ID</TabsTrigger>
              <TabsTrigger value="google">Google OAuth</TabsTrigger>
            </TabsList>

            <TabsContent value="employee" className="space-y-4">
              <form onSubmit={handleEmployeeLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID</Label>
                  <Input
                    id="employeeId"
                    type="text"
                    placeholder="Masukkan Employee ID"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-11" 
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Login...</span>
                    </div>
                  ) : (
                    "Login dengan Employee ID"
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-gray-600">
                <p>Demo credentials:</p>
                <p className="font-mono bg-gray-100 p-2 rounded mt-1">
                  Employee ID: ADMIN001 | Password: admin123
                </p>
              </div>
            </TabsContent>

            <TabsContent value="google" className="space-y-4">
              <div className="text-center space-y-4">
                <p className="text-sm text-gray-600">
                  Login menggunakan akun Google yang telah terdaftar
                  sebagai employee CODEN.
                </p>

                <Button
                  onClick={handleGoogleLogin}
                  variant="outline"
                  className="w-full h-11"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span>Redirecting...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🔐</span>
                      <span>Login dengan Google</span>
                    </div>
                  )}
                </Button>

                <div className="text-xs text-gray-500">
                  <p>Sistem akan memverifikasi bahwa akun Google Anda</p>
                  <p>telah terdaftar sebagai employee CODEN.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <Button
                variant="link"
                size="sm"
                onClick={() => router.push("/")}
                className="text-sm text-gray-600"
              >
                ← Kembali ke Beranda
              </Button>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
            <div className="flex justify-between items-center">
              <span>CODEN Management System</span>
              <span className="font-mono">v1.0.0</span>
            </div>
            <div className="mt-1">
              <span>Salatiga, Central Java • Indonesia</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}