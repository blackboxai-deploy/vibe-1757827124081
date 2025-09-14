import { NextRequest, NextResponse } from "next/server";

const mockUsers = [
  {
    id: "admin-1",
    employeeId: "ADMIN001", 
    email: "admin@coden.gutes.id",
    name: "Super Admin",
    role: "ADMIN",
    isActive: true
  },
  {
    id: "staff-1", 
    employeeId: "STAFF001",
    email: "staff@coden.gutes.id", 
    name: "Customer Experience Staff",
    role: "STAFF",
    isActive: true
  }
];

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: "Token tidak ditemukan" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer "
    
    try {
      // Decode token (simplified - use proper JWT verification in production)
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
      
      // Check if token expired
      if (decoded.exp < Date.now()) {
        return NextResponse.json(
          { message: "Token sudah expired" },
          { status: 401 }
        );
      }

      // Find user
      const user = mockUsers.find(u => u.id === decoded.userId);
      
      if (!user) {
        return NextResponse.json(
          { message: "User tidak ditemukan" },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Token valid",
        user
      });

    } catch (decodeError) {
      return NextResponse.json(
        { message: "Token tidak valid" },
        { status: 401 }
      );
    }

  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}