import QRCode from 'qrcode';

export async function generateTicketQRCode(reservationId) {
  try {
    return await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-ticket/${reservationId}`,
      {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }
    );
  } catch (error) {
    console.error('Erreur génération QR code:', error);
    throw new Error('Impossible de générer le QR code');
  }
} 