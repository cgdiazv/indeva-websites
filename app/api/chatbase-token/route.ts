import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET() {
  try {
    // 1. Get the current logged-in user from your auth session (e.g., Firebase Auth)
    // For this example, we assume you have a way to verify the active session.
    const userId = "user_unique_id_from_auth"; 
    const userEmail = "user_email@example.com";

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secretKey = process.env.CHATBASE_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Missing Chatbase configuration' }, { status: 500 });
    }

    // 2. Generate the JWT payload matching Chatbase's requirements
    const payload = {
      userId: userId,
      email: userEmail,
      iat: Math.floor(Date.now() / 1000),
      // Optional: set an expiration time (e.g., 1 hour)
      exp: Math.floor(Date.now() / 1000) + (60 * 60), 
    };

    // 3. Sign the token using your secret key
    const token = jwt.sign(payload, secretKey, { algorithm: 'HS256' });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Failed to generate secure chat token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}