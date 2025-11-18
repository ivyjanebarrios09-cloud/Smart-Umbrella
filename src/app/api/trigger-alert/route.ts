// src/app/api/trigger-alert/route.ts
import { NextRequest } from "next/server";

// ←←← PUT YOUR VALUES HERE ←←←
const FIREBASE_PROJECT_ID = "studio-2370514225-ff786";
const WEB_API_KEY = "AIzaSyCzJNObeXMkJ8QhJwsPE_CAwEwm4l7koos";   // your public Web API key

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    // 1. Verify the ID token using Google's REST API (never fails with 500)
    const tokenResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${WEB_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      }
    );

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      console.error("Token verification failed:", err);
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    const tokenData = await tokenResponse.json();
    const uid = tokenData.users[0].localId;   // this is the real Firebase UID

    // 2. Write to Firestore (also pure REST – works perfectly)
    const nowSeconds = Math.floor(Date.now() / 1000);

    const firestorePayload = {
      fields: {
        trigger: { booleanValue: true },
        updatedAt: { integerValue: nowSeconds.toString() },
      },
    };

    const firestoreResponse = await fetch(
      `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${uid}/alert?key=${WEB_API_KEY}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(firestorePayload),
      }
    );

    if (!firestoreResponse.ok) {
      const err = await firestoreResponse.text();
      console.error("Firestore write failed:", err);
      return new Response(JSON.stringify({ error: "Failed to write to Firestore" }), { status: 500 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}