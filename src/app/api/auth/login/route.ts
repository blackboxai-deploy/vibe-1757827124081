import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Mock user database - replace with real database
const mockUsers = [
  {
    id: "admin-1",
    employeeId: "ADMIN001", 
    email: "admin@coden.gutes.id",
    name: "Super Admin",
    role: "ADMIN",
    password: "admin123",
    isActive: true
  },
  {
    id: "staff-1", 
    employeeId: "STAFF001",
    email: "staff@coden.gutes.id", 
    name: "Customer Experience Staff",
    role: "STAFF",
    password: "staff123",
    isActive: true
  }
];

export async function POST(request: NextRequest) {
  try {
    const { employeeId, email, phone, password } = await request.json();

    // Validate required fields
    if (!password || (!employeeId && !email && !phone)) {
      return NextResponse.json(
        { message: "Employee ID/email/phone dan password harus diisi" },
        { status: 400 }
      );
    }

    // Find user by employeeId, email, or phone
    let user = mockUsers.find(u => 
      (employeeId && u.employeeId === employeeId) ||
      (email && u.email === email)
    );

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Verify password
    if (user.password !== password) {
      return NextResponse.json(
        { message: "Password salah" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        { message: "Akun tidak aktif" },
        { status: 403 }
      );
    }

    // Generate JWT token (simplified - use proper JWT in production)
    const token = Buffer.from(JSON.stringify({
      userId: user.id,
      role: user.role,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    })).toString('base64');

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'coden_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: "Login berhasil",
      user: userWithoutPassword,
      token
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}