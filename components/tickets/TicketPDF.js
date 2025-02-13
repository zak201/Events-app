'use client';

import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { formatDate } from '@/lib/utils';
import { registerPDFFonts } from '@/lib/fonts';

// Enregistrer les polices
registerPDFFonts();

// Styles pour le PDF avec plus de variantes de police
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Inter'
  },
  header: {
    marginBottom: 20,
    borderBottom: '1 solid #e5e7eb',
    paddingBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: 500
  },
  eventInfo: {
    marginBottom: 20
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center'
  },
  label: {
    width: 100,
    color: '#6b7280',
    fontSize: 12
  },
  value: {
    flex: 1,
    color: '#111827',
    fontSize: 12,
    fontWeight: 700
  },
  qrSection: {
    alignItems: 'center',
    marginTop: 30
  },
  qrCode: {
    width: 150,
    height: 150
  },
  qrLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 10,
    textAlign: 'center'
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 10,
    borderTop: '1 solid #e5e7eb',
    paddingTop: 20
  }
});

export default function TicketPDF({ event, reservation, qrCodeUrl }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>Billet d'entrée</Text>
        </View>

        <View style={styles.eventInfo}>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{formatDate(event.date)}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Lieu</Text>
            <Text style={styles.value}>{event.location}</Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Places</Text>
            <Text style={styles.value}>
              {reservation.seats} place{reservation.seats > 1 ? 's' : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Réservé par</Text>
            <Text style={styles.value}>
              {reservation.userDetails.firstName} {reservation.userDetails.lastName}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{reservation.userDetails.email}</Text>
          </View>
        </View>

        <View style={styles.qrSection}>
          <Image src={qrCodeUrl} style={styles.qrCode} />
          <Text style={styles.qrLabel}>
            Scannez ce QR code pour valider votre billet
          </Text>
        </View>

        <Text style={styles.footer}>
          Ce billet est personnel et ne peut être revendu.{'\n'}
          ID de réservation : {reservation._id}
        </Text>
      </Page>
    </Document>
  );
} 