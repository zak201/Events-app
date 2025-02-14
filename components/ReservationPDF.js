'use client';

import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    marginBottom: 15
  },
  heading: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 12,
    marginBottom: 5
  },
  qrCode: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 20
  }
});

const ReservationDocument = ({ reservation, event }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Confirmation de réservation</Text>
      
      <View style={styles.section}>
        <Text style={styles.heading}>Détails de l'événement</Text>
        <Text style={styles.text}>Événement : {event.title}</Text>
        <Text style={styles.text}>
          Date : {format(new Date(event.date), 'PPP à HH:mm', { locale: fr })}
        </Text>
        <Text style={styles.text}>Lieu : {event.location}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Informations de réservation</Text>
        <Text style={styles.text}>N° de réservation : {reservation._id}</Text>
        <Text style={styles.text}>Nombre de places : {reservation.seats}</Text>
        <Text style={styles.text}>
          Statut : {reservation.status === 'confirmed' ? 'Confirmée' : 'En attente'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Participant</Text>
        <Text style={styles.text}>Nom : {reservation.lastName}</Text>
        <Text style={styles.text}>Prénom : {reservation.firstName}</Text>
        <Text style={styles.text}>Email : {reservation.email}</Text>
      </View>
    </Page>
  </Document>
);

export default function ReservationPDF({ reservation, event }) {
  return (
    <PDFDownloadLink
      document={<ReservationDocument reservation={reservation} event={event} />}
      fileName={`reservation-${reservation._id}.pdf`}
      className="btn btn-secondary"
    >
      {({ loading }) =>
        loading ? 'Génération du PDF...' : 'Télécharger le PDF'
      }
    </PDFDownloadLink>
  );
} 