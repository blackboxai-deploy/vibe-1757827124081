import { NextRequest, NextResponse } from "next/server";

interface XenditPaymentRequest {
  bookingId: string;
  amount: number;
  customerName: string;
  customerPhone: string;
  description?: string;
}

interface XenditInvoice {
  id: string;
  external_id: string;
  user_id: string;
  status: string;
  merchant_name: string;
  amount: number;
  paid_amount?: number;
  invoice_url: string;
  expiry_date: string;
  created: string;
  updated: string;
}

export async function POST(request: NextRequest) {
  try {
    const { bookingId, amount, customerName, customerPhone, description }: XenditPaymentRequest = await request.json();

    // Validate required fields
    if (!bookingId || !amount || !customerName) {
      return NextResponse.json(
        { message: "bookingId, amount, dan customerName harus diisi" },
        { status: 400 }
      );
    }

    // Create Xendit invoice for QRIS payment
    const invoice = await createXenditInvoice({
      external_id: `CODEN_${bookingId}`,
      amount,
      description: description || `CODEN Booking - ${bookingId}`,
      customer: {
        given_names: customerName,
        mobile_number: customerPhone
      },
      payment_methods: ["QRIS"],
      currency: "IDR"
    });

    return NextResponse.json({
      message: "Payment invoice created successfully",
      invoice: {
        id: invoice.id,
        external_id: invoice.external_id,
        amount: invoice.amount,
        status: invoice.status,
        invoice_url: invoice.invoice_url,
        qr_string: invoice.qr_string,
        expiry_date: invoice.expiry_date
      }
    });

  } catch (error) {
    console.error("Xendit payment creation error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat payment" },
      { status: 500 }
    );
  }
}

// Get payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get("invoiceId");
    const externalId = searchParams.get("externalId");

    if (!invoiceId && !externalId) {
      return NextResponse.json(
        { message: "invoiceId atau externalId harus diisi" },
        { status: 400 }
      );
    }

    let invoice;
    if (invoiceId) {
      invoice = await getXenditInvoiceById(invoiceId);
    } else {
      invoice = await getXenditInvoiceByExternalId(externalId!);
    }

    return NextResponse.json({
      invoice: {
        id: invoice.id,
        external_id: invoice.external_id,
        status: invoice.status,
        amount: invoice.amount,
        paid_amount: invoice.paid_amount,
        payment_method: invoice.payment_method,
        paid_at: invoice.paid_at,
        created: invoice.created,
        updated: invoice.updated
      }
    });

  } catch (error) {
    console.error("Xendit payment status error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil status payment" },
      { status: 500 }
    );
  }
}

// Create payment link for additional services
export async function PUT(request: NextRequest) {
  try {
    const { bookingId, amount, description, customerPhone } = await request.json();

    // Create payment link for extending time or additional services
    const paymentLink = await createXenditPaymentLink({
      external_id: `CODEN_ADDON_${bookingId}_${Date.now()}`,
      amount,
      description: description || `CODEN Additional Service - ${bookingId}`,
      customer_notification_preference: {
        invoice_created: ["whatsapp"],
        invoice_reminder: ["whatsapp"],
        invoice_paid: ["whatsapp"]
      },
      customer: {
        mobile_number: customerPhone
      }
    });

    return NextResponse.json({
      message: "Payment link created successfully",
      payment_link: {
        id: paymentLink.id,
        external_id: paymentLink.external_id,
        amount: paymentLink.amount,
        checkout_url: paymentLink.checkout_url,
        status: paymentLink.status
      }
    });

  } catch (error) {
    console.error("Xendit payment link error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat payment link" },
      { status: 500 }
    );
  }
}

// Helper functions for Xendit API
async function createXenditInvoice(invoiceData: any): Promise<any> {
  try {
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    
    if (!xenditSecretKey) {
      throw new Error("Xendit secret key not configured");
    }

    // In production, use actual Xendit API
    // For demo purposes, we'll simulate the API response
    console.log("Creating Xendit invoice:", invoiceData);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful invoice creation
    const mockInvoice = {
      id: `inv_${Math.random().toString(36).substr(2, 9)}`,
      external_id: invoiceData.external_id,
      user_id: "mock_user_id",
      status: "PENDING",
      merchant_name: "CODEN by Gutes",
      amount: invoiceData.amount,
      invoice_url: `https://checkout.xendit.co/web/${Math.random().toString(36).substr(2, 20)}`,
      qr_string: `https://qr.xendit.co/${Math.random().toString(36).substr(2, 15)}`,
      expiry_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
    
    return mockInvoice;
    
  } catch (error) {
    throw error;
  }
}

async function getXenditInvoiceById(invoiceId: string): Promise<any> {
  try {
    console.log("Getting Xendit invoice by ID:", invoiceId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock invoice data
    return {
      id: invoiceId,
      external_id: `CODEN_${Math.random().toString(36).substr(2, 8)}`,
      status: Math.random() > 0.5 ? "PAID" : "PENDING",
      amount: 150000,
      paid_amount: Math.random() > 0.5 ? 150000 : 0,
      payment_method: "QRIS",
      paid_at: Math.random() > 0.5 ? new Date().toISOString() : null,
      created: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      updated: new Date().toISOString()
    };
    
  } catch (error) {
    throw error;
  }
}

async function getXenditInvoiceByExternalId(externalId: string): Promise<any> {
  try {
    console.log("Getting Xendit invoice by external ID:", externalId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock invoice data
    return {
      id: `inv_${Math.random().toString(36).substr(2, 9)}`,
      external_id: externalId,
      status: Math.random() > 0.3 ? "PAID" : "PENDING",
      amount: 200000,
      paid_amount: Math.random() > 0.3 ? 200000 : 0,
      payment_method: "QRIS",
      paid_at: Math.random() > 0.3 ? new Date().toISOString() : null,
      created: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      updated: new Date().toISOString()
    };
    
  } catch (error) {
    throw error;
  }
}

async function createXenditPaymentLink(linkData: any): Promise<any> {
  try {
    console.log("Creating Xendit payment link:", linkData);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock payment link
    return {
      id: `plink_${Math.random().toString(36).substr(2, 9)}`,
      external_id: linkData.external_id,
      amount: linkData.amount,
      checkout_url: `https://checkout.xendit.co/v2/link/${Math.random().toString(36).substr(2, 20)}`,
      status: "ACTIVE"
    };
    
  } catch (error) {
    throw error;
  }
}