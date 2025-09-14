import { NextRequest, NextResponse } from "next/server";

interface WhatsAppMessage {
  phone: string;
  message: string;
  type: "text" | "image" | "document";
  mediaUrl?: string;
}

interface BookingNotification {
  bookingId: string;
  phone: string;
  customerName: string;
  type: "check_in_code" | "internet_credentials" | "payment_reminder" | "booking_confirmation" | "thank_you";
  data?: any;
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, phone, customerName, type, data }: BookingNotification = await request.json();

    // Validate required fields
    if (!phone || !type) {
      return NextResponse.json(
        { message: "phone dan type harus diisi" },
        { status: 400 }
      );
    }

    let message = "";
    
    // Generate message based on type
    switch (type) {
      case "check_in_code":
        message = generateCheckInMessage(customerName, bookingId, data?.checkInCode);
        break;
      
      case "internet_credentials":
        message = generateInternetCredentialsMessage(customerName, data?.username, data?.password);
        break;
      
      case "payment_reminder":
        message = generatePaymentReminderMessage(customerName, data?.amount, data?.paymentUrl);
        break;
      
      case "booking_confirmation":
        message = generateBookingConfirmationMessage(customerName, data);
        break;
      
      case "thank_you":
        message = generateThankYouMessage(customerName, data?.rating);
        break;
      
      default:
        return NextResponse.json(
          { message: "Invalid notification type" },
          { status: 400 }
        );
    }

    // Send WhatsApp message via Fonnte
    const result = await sendWhatsAppMessage({
      phone,
      message,
      type: "text"
    });

    if (result.success) {
      return NextResponse.json({
        message: "WhatsApp notification sent successfully",
        messageId: result.messageId,
        phone,
        type
      });
    } else {
      throw new Error(result.error);
    }

  } catch (error) {
    console.error("WhatsApp notification error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim notifikasi WhatsApp" },
      { status: 500 }
    );
  }
}

// Send bulk notifications
export async function PUT(request: NextRequest) {
  try {
    const { notifications } = await request.json();

    if (!Array.isArray(notifications)) {
      return NextResponse.json(
        { message: "notifications harus berupa array" },
        { status: 400 }
      );
    }

    const results = [];
    
    for (const notification of notifications) {
      try {
        const result = await sendWhatsAppMessage({
          phone: notification.phone,
          message: notification.message,
          type: "text"
        });
        
        results.push({
          phone: notification.phone,
          success: result.success,
          messageId: result.messageId,
          error: result.error
        });
      } catch (error) {
        results.push({
          phone: notification.phone,
          success: false,
          error: String(error)
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      message: `${successCount}/${notifications.length} notifications sent successfully`,
      results
    });

  } catch (error) {
    console.error("Bulk WhatsApp notification error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengirim bulk notification" },
      { status: 500 }
    );
  }
}

// Check message delivery status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { message: "messageId harus diisi" },
        { status: 400 }
      );
    }

    const status = await checkMessageStatus(messageId);

    return NextResponse.json({
      messageId,
      status: status.status,
      deliveredAt: status.deliveredAt,
      readAt: status.readAt
    });

  } catch (error) {
    console.error("Message status check error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengecek status message" },
      { status: 500 }
    );
  }
}

// Helper functions for message templates
function generateCheckInMessage(customerName: string, bookingId: string, checkInCode?: string): string {
  return `
🏢 *CODEN by Gutes - Check-in Info*

Halo ${customerName}! 

Booking Anda telah dikonfirmasi:
📋 Booking ID: ${bookingId}
🔑 Kode Check-in: *${checkInCode || bookingId}*

Cara Check-in:
1. Datang ke CODEN dan tunjukkan kode ini ke staff
2. Staff akan mengaktifkan akses internet Anda
3. Selamat bekerja produktif! 

📍 Alamat: Salatiga, Jawa Tengah
⏰ Buka: 08:00 - 22:00 WIB
📞 Info: +62-xxx-xxx-xxxx

Terima kasih telah memilih CODEN! 🚀
  `.trim();
}

function generateInternetCredentialsMessage(customerName: string, username?: string, password?: string): string {
  return `
🌐 *CODEN - Akses Internet Aktif*

Halo ${customerName}!

Akses internet Anda telah diaktifkan:
👤 Username: *${username}*
🔒 Password: *${password}*

Cara Koneksi:
1. Pilih WiFi "CODEN-Guest"
2. Masukkan username & password di atas
3. Nikmati internet high-speed!

Jika ada kendala, silakan hubungi staff kami.

Happy working! 💻✨
  `.trim();
}

function generatePaymentReminderMessage(customerName: string, amount?: number, paymentUrl?: string): string {
  const formattedAmount = amount ? new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0
  }).format(amount) : "";

  return `
💳 *CODEN - Reminder Pembayaran*

Halo ${customerName}!

Pembayaran booking Anda sebesar *${formattedAmount}* belum selesai.

${paymentUrl ? `💰 Link Pembayaran: ${paymentUrl}` : ""}

Silakan selesaikan pembayaran untuk mengaktifkan booking Anda.

Bantuan pembayaran: +62-xxx-xxx-xxxx

Terima kasih! 🙏
  `.trim();
}

function generateBookingConfirmationMessage(customerName: string, data: any): string {
  const formatDateTime = (date: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(date));
  };

  return `
✅ *CODEN - Booking Confirmed*

Halo ${customerName}!

Booking Anda telah berhasil dikonfirmasi:

🏢 Area: ${data?.areaName || "N/A"}
📅 Tanggal: ${data?.startTime ? formatDateTime(data.startTime) : "N/A"}
⏰ Durasi: ${data?.duration || "N/A"} menit
💰 Total: ${data?.amount ? new Intl.NumberFormat("id-ID", {
      style: "currency", 
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(data.amount) : "N/A"}

Kode check-in akan dikirim H-1 atau saat Anda tiba di lokasi.

Sampai jumpa di CODEN! 🎉
  `.trim();
}

function generateThankYouMessage(customerName: string, rating?: number): string {
  return `
🙏 *Terima Kasih - CODEN by Gutes*

Halo ${customerName}!

Terima kasih telah menggunakan fasilitas CODEN hari ini!

${rating ? `⭐ Rating Anda: ${rating}/5 bintang` : ""}

Kami berharap Anda puas dengan layanan kami. 

📝 Feedback & saran: wa.me/62xxx (sangat dihargai!)
🔄 Booking lagi: ${typeof window !== 'undefined' ? window.location.origin : 'https://coden.gutes.id'}/customer

Sampai jumpa lagi! 👋✨
  `.trim();
}

// Helper functions for Fonnte API
async function sendWhatsAppMessage(messageData: WhatsAppMessage): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fonnte_token = "your-fonnte-token"; // In production, use process.env.FONNTE_API_TOKEN
    
    if (!fonnte_token) {
      throw new Error("Fonnte API token not configured");
    }

    console.log("Sending WhatsApp message:", messageData);
    
    // In production, use actual Fonnte API
    // For demo purposes, we'll simulate the API response
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful message sending
    const mockMessageId = `msg_${Math.random().toString(36).substr(2, 12)}`;
    
    return {
      success: true,
      messageId: mockMessageId
    };
    
  } catch (error) {
    return {
      success: false,
      error: String(error)
    };
  }
}

async function checkMessageStatus(messageId: string): Promise<{ status: string; deliveredAt?: string; readAt?: string }> {
  try {
    console.log("Checking message status:", messageId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock message status
    const statuses = ["sent", "delivered", "read"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    return {
      status: randomStatus,
      deliveredAt: randomStatus !== "sent" ? new Date().toISOString() : undefined,
      readAt: randomStatus === "read" ? new Date().toISOString() : undefined
    };
    
  } catch (error) {
    throw error;
  }
}