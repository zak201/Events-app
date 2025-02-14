import QRCode from 'qrcode';

export async function generateTicketQRCode(reservationId) {
  try {
    // Vérifier que l'URL de base est définie
    if (!process.env.NEXT_PUBLIC_APP_URL) {
      throw new Error('NEXT_PUBLIC_APP_URL n\'est pas défini');
    }

    // Générer l'URL complète pour la vérification du billet
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-ticket/${reservationId}`;

    // Options de configuration du QR code
    const options = {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H', // Niveau de correction d'erreur élevé
      type: 'image/png',
      quality: 0.92
    };

    // Générer le QR code en base64
    const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl, options);
    
    // Vérifier que le QR code a bien été généré
    if (!qrCodeDataUrl.startsWith('data:image/png;base64,')) {
      throw new Error('Format de QR code invalide');
    }

    return qrCodeDataUrl;
  } catch (error) {
    console.error('Erreur génération QR code:', error);
    throw new Error('Impossible de générer le QR code');
  }
} 