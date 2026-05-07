import { Resend } from 'resend';
import { NextResponse } from 'next/server';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY environment variable');
  }
  return new Resend(apiKey);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload: Record<string, any> = {};

    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else if (
      contentType.includes('application/x-www-form-urlencoded') ||
      contentType.includes('multipart/form-data')
    ) {
      const formData = await request.formData();
      const challengeValues = formData.getAll('challenge').map((value) => value.toString());

      payload = {
        name: formData.get('name')?.toString() ?? '',
        email: formData.get('email')?.toString() ?? '',
        phone: formData.get('phone')?.toString() ?? '',
        website: formData.get('website')?.toString() ?? '',
        goal: formData.get('goal')?.toString() ?? '',
        message: formData.get('message')?.toString() ?? '',
        challenge: challengeValues,
      };
    } else {
      payload = await request.json();
    }

    const {
      name = 'No name provided',
      email = 'No email provided',
      phone = 'No phone provided',
      website = 'No website provided',
      goal = 'No goal provided',
      challenge = [],
      message = 'No message provided',
    } = payload;

    const challengeList = Array.isArray(challenge)
      ? challenge.filter(Boolean).join(', ') || 'Not specified'
      : challenge || 'Not specified';

    const emailBody = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Current website: ${website}`,
      `Primary goal (next 6 months): ${goal}`,
      `Challenges: ${challengeList}`,
      '',
      'Message:',
      message,
    ].join('\n');

    const resend = getResendClient();
    const data = await resend.emails.send({
      from: 'Indeva Websites <contact@indevasa.com>', // Your newly verified domain
      to: 'web@indevasa.com', // Your desired destination
      subject: `New Lead from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}
