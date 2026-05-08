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

    // Robust parsing for different form submission methods
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

    // Set fallbacks so the email never has empty blank spaces
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

    // The beautiful HTML Template using your dynamic variables
    const htmlEmail = `
      <!DOCTYPE html>
      <html>
      <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #f8f9fa; padding: 20px; border-bottom: 2px solid #ff8c00; }
        .header h2 { margin: 0; color: #222; font-size: 18px; text-transform: uppercase; letter-spacing: 1px; }
        .content { padding: 20px; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table td { padding: 12px 8px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
        .label { font-weight: bold; color: #555; width: 160px; }
        .value { color: #000; }
        .message-box { background-color: #fdfdfd; border: 1px inset #eee; padding: 15px; margin-top: 10px; font-style: italic; white-space: pre-wrap; }
        .footer { background-color: #f8f9fa; padding: 15px; font-size: 12px; color: #888; text-align: center; }
        .badge { background: #ff8c00; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
      </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New High-Value Lead Detected <span class="badge">INDEVA</span></h2>
          </div>
          <div class="content">
            <p>Carlos, a new potential partner has requested a Strategy Call via Indevasa.com.</p>
            
            <table class="data-table">
              <tr>
                <td class="label">Client Name:</td>
                <td class="value">${name}</td>
              </tr>
              <tr>
                <td class="label">Email Address:</td>
                <td class="value"><a href="mailto:${email}">${email}</a></td>
              </tr>
              <tr>
                <td class="label">Phone Number:</td>
                <td class="value">${phone}</td>
              </tr>
              <tr>
                <td class="label">Current Website:</td>
                <td class="value"><a href="${website}">${website}</a></td>
              </tr>
              <tr>
                <td class="label">Primary Challenge:</td>
                <td class="value"><strong>${challengeList}</strong></td>
              </tr>
              <tr>
                <td class="label">Primary Goal:</td>
                <td class="value">${goal}</td>
              </tr>
            </table>

            <p><strong>Additional Context/Message:</strong></p>
            <div class="message-box">
              ${message}
            </div>
          </div>
          <div class="footer">
            This is an automated priority lead notification from your Indevasa Sales Engine.
          </div>
        </div>
      </body>
      </html>
    `;

    const resend = getResendClient();
    
    // Using the html field instead of text to render the template
    const data = await resend.emails.send({
      from: 'Indeva Websites <contact@indevasa.com>', 
      to: 'web@indevasa.com', 
      subject: `🔥 New Strategy Call Request: ${name}`,
      html: htmlEmail, 
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) });
  }
}