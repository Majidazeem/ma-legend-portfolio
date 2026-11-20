import { NextResponse } from "next/server";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json() as { name?: string; email?: string; message?: string };
    const name = body.name?.trim() ?? "", email = body.email?.trim() ?? "", message = body.message?.trim() ?? "";
    if (!name || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !message || message.length > 3000) return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (!projectId || !clientEmail || !privateKey || !process.env.FIREBASE_DATABASE_URL) return NextResponse.json({ error: "Contact service is not configured. Please use the social links." }, { status: 503 });
    const adminApp = getApps().find(a => a.name === "server-admin") ?? initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), databaseURL: process.env.FIREBASE_DATABASE_URL }, "server-admin");
    await getDatabase(adminApp).ref("inquiries").push({ name, email, message, createdAt: Date.now() });
    return NextResponse.json({ ok: true });
  } catch (error) { console.error("Contact submission failed", error); return NextResponse.json({ error: "Unable to send message" }, { status: 500 }); }
}
