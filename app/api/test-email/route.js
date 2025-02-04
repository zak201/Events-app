import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'z.anouar832@gmail.com',
      subject: 'Test Email',
      html: `
        <h1>Test de l'envoi d'email</h1>
        <p>Si vous recevez cet email, la configuration est correcte !</p>
      `
    });

    console.log('Email envoyé:', data);
    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Erreur d\'envoi:', error);
    return Response.json({ success: false, error: error.message });
  }
} 