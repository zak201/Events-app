import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { dbConnect } from '@/lib/dbConnect';
import Reservation from '@/models/Reservation';
import { renderToStream } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import TicketPDF from '@/components/tickets/TicketPDF';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    await dbConnect();
    const reservation = await Reservation.findById(params.id)
      .populate('eventId')
      .populate('userId', 'name email');

    if (!reservation) {
      return NextResponse.json(
        { message: 'Billet non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur a le droit de télécharger ce billet
    if (
      session.user.id !== reservation.userId._id.toString() &&
      session.user.role !== 'organisateur'
    ) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Générer le QR code
    const qrCodeUrl = await QRCode.toDataURL(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-ticket/${reservation._id}`
    );

    // Générer le PDF
    const pdfStream = await renderToStream(
      <TicketPDF 
        event={reservation.eventId} 
        reservation={reservation}
        qrCodeUrl={qrCodeUrl}
      />
    );

    // Convertir le stream en buffer
    const chunks = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Retourner le PDF
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="billet-${reservation._id}.pdf"`
      }
    });
  } catch (error) {
    console.error('Erreur génération PDF:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la génération du PDF' },
      { status: 500 }
    );
  }
} 