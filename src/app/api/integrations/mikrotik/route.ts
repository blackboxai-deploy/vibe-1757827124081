import { NextRequest, NextResponse } from "next/server";

interface MikrotikCredentials {
  username: string;
  password: string;
  profile?: string;
  bandwidth?: string;
}

interface InternetAccessRequest {
  action: "create" | "enable" | "disable" | "delete";
  bookingId: string;
  customerName: string;
  duration: number; // in minutes
  bandwidth?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { action, bookingId, customerName, duration, bandwidth = "5M/5M" }: InternetAccessRequest = await request.json();

    // Validate required fields
    if (!action || !bookingId) {
      return NextResponse.json(
        { message: "Action dan bookingId harus diisi" },
        { status: 400 }
      );
    }

    // Generate username and password for customer
    const credentials: MikrotikCredentials = {
      username: `coden_${bookingId.toLowerCase()}`,
      password: generateRandomPassword(),
      profile: "coden_profile",
      bandwidth
    };

    // Mikrotik API configuration
    const mikrotikConfig = {
      host: process.env.MIKROTIK_HOST || "192.168.1.1",
      username: process.env.MIKROTIK_USERNAME || "admin",
      password: process.env.MIKROTIK_PASSWORD || "admin"
    };

    switch (action) {
      case "create":
        // Create new user in Mikrotik
        const createResult = await createMikrotikUser(mikrotikConfig, credentials, duration);
        if (createResult.success) {
          return NextResponse.json({
            message: "Internet access created successfully",
            credentials: {
              username: credentials.username,
              password: credentials.password,
              bandwidth: credentials.bandwidth,
              expiresAt: new Date(Date.now() + duration * 60 * 1000)
            }
          });
        } else {
          throw new Error(createResult.error);
        }

      case "enable":
        // Enable existing user
        const enableResult = await enableMikrotikUser(mikrotikConfig, credentials.username);
        if (enableResult.success) {
          return NextResponse.json({
            message: "Internet access enabled successfully"
          });
        } else {
          throw new Error(enableResult.error);
        }

      case "disable":
        // Disable user
        const disableResult = await disableMikrotikUser(mikrotikConfig, credentials.username);
        if (disableResult.success) {
          return NextResponse.json({
            message: "Internet access disabled successfully"
          });
        } else {
          throw new Error(disableResult.error);
        }

      case "delete":
        // Delete user
        const deleteResult = await deleteMikrotikUser(mikrotikConfig, credentials.username);
        if (deleteResult.success) {
          return NextResponse.json({
            message: "Internet access deleted successfully"
          });
        } else {
          throw new Error(deleteResult.error);
        }

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Mikrotik integration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengelola akses internet" },
      { status: 500 }
    );
  }
}

// Get internet usage statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { message: "Username harus diisi" },
        { status: 400 }
      );
    }

    const mikrotikConfig = {
      host: process.env.MIKROTIK_HOST || "192.168.1.1",
      username: process.env.MIKROTIK_USERNAME || "admin",
      password: process.env.MIKROTIK_PASSWORD || "admin"
    };

    const usage = await getMikrotikUserUsage(mikrotikConfig, username);

    return NextResponse.json({
      username,
      usage: {
        uploadBytes: usage.uploadBytes || 0,
        downloadBytes: usage.downloadBytes || 0,
        totalBytes: (usage.uploadBytes || 0) + (usage.downloadBytes || 0),
        sessionTime: usage.sessionTime || 0,
        lastActivity: usage.lastActivity
      }
    });

  } catch (error) {
    console.error("Mikrotik usage error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data usage" },
      { status: 500 }
    );
  }
}

// Helper functions for Mikrotik API
async function createMikrotikUser(
  config: any,
  credentials: MikrotikCredentials,
  duration: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // In production, use actual Mikrotik API library (node-routeros)
    // For demo purposes, we'll simulate the API call
    
    console.log(`Creating Mikrotik user: ${credentials.username}`);
    console.log(`Duration: ${duration} minutes`);
    console.log(`Bandwidth: ${credentials.bandwidth}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful creation
    return { success: true };
    
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function enableMikrotikUser(
  config: any,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Enabling Mikrotik user: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function disableMikrotikUser(
  config: any,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Disabling Mikrotik user: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function deleteMikrotikUser(
  config: any,
  username: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Deleting Mikrotik user: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

async function getMikrotikUserUsage(config: any, username: string) {
  try {
    console.log(`Getting usage for Mikrotik user: ${username}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock usage data
    return {
      uploadBytes: Math.floor(Math.random() * 1000000000), // Random bytes
      downloadBytes: Math.floor(Math.random() * 5000000000),
      sessionTime: Math.floor(Math.random() * 7200), // Random seconds
      lastActivity: new Date()
    };
  } catch (error) {
    throw error;
  }
}

function generateRandomPassword(length: number = 8): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}