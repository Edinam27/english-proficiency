import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Student } from '@prisma/client';
import { SIGNATORIES } from '@/lib/constants';

const styles = StyleSheet.create({
  page: {
    paddingTop: 120,
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Times-Roman',
    fontSize: 12,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    fontFamily: 'Times-Bold',
    fontSize: 12,
    alignItems: 'flex-start',
  },
  refSection: {
    marginBottom: 0,
  },
  dateSection: {
    marginTop: 20,
    alignSelf: 'flex-end',
  },
  title: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    textAlign: 'left',
    textDecoration: 'underline',
    marginBottom: 5,
    marginTop: 20,
    textTransform: 'uppercase',
    hyphenation: false,
  },
  subtitle: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    textAlign: 'left',
    textDecoration: 'underline',
    marginBottom: 20,
    marginTop: 5,
    textTransform: 'uppercase',
    hyphenation: false,
  },
  bodyText: {
    marginBottom: 15,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    fontSize: 12,
    hyphenation: false,
  },
  signatureSection: {
    marginTop: 50,
  },
  signatureName: {
    fontFamily: 'Times-Bold',
    marginTop: 40,
  },
  signatureTitle: {
    fontFamily: 'Times-Roman',
  },
});

export const AttestationPage = ({ student }: { student: Student }) => {
  const {
    firstName,
    otherNames,
    lastName,
    indexNumber,
    gender,
    programme,
    completionMonth,
    completionYear,
    duration,
    graduationDate,
    certificateNumber,
    signatory: signatoryId,
  } = student;

  const signatory = SIGNATORIES.find(s => s.id === signatoryId) || SIGNATORIES.find(s => s.id === 'ANTHONY_AFEADIE') || SIGNATORIES[0];

  const formatName = (name: string | undefined | null) => (name || '').trim().replace(/\s+/g, '\u00A0');
  const fullName = `${formatName(firstName)} ${otherNames ? formatName(otherNames) + ' ' : ''}${formatName(lastName)}`;
  const titleHeader = gender === 'MALE' ? 'MR.' : 'MS.';
  const titleBody = gender === 'MALE' ? 'Mr.' : 'Ms.';
  const pronounSubject = gender === 'MALE' ? 'He' : 'She';
  const pronounObject = gender === 'MALE' ? 'him' : 'her';
  const pronounPossessive = gender === 'MALE' ? 'his' : 'her';

  // Calculate Start Year logic
  const endYearInt = parseInt(completionYear, 10);
  // Use explicit admissionYear if available, otherwise fallback to calculation
  const startYear = student.admissionYear || (isNaN(endYearInt) ? 'UNKNOWN' : (endYearInt - duration).toString());

  const today = new Date();
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const day = today.getDate();
  const ordinalDate = `${getOrdinal(day)} ${today.toLocaleString('default', { month: 'long' })}, ${today.getFullYear()}`;

  // Ref No Logic: AA/MKA/ [Index]
  const refPrefix = 'AA/MKA';
  const refNo = `${refPrefix}/${indexNumber}`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.refSection}>
          <Text>My Ref. No: {refNo}</Text>
          <Text>Your Ref. No:</Text>
        </View>
        <View style={styles.dateSection}>
          <Text>{ordinalDate}</Text>
        </View>
      </View>

      <Text style={{ fontFamily: 'Times-Bold', marginBottom: 10, textDecoration: 'underline', textAlign: 'center' }}>
        {student.addressee || 'TO WHOM IT MAY CONCERN'}
      </Text>

      <Text style={styles.title}>
        ATTESTATION
      </Text>
      <Text style={styles.subtitle}>
        RE: {titleHeader} {fullName.toUpperCase()} (STUDENT{'\u00A0'}ID{'\u00A0'}NO:{'\u00A0'}{indexNumber})
      </Text>

      <Text style={styles.bodyText}>
        This is to certify that {titleBody} {fullName} was a bona fide student of the University of Professional Studies, Accra from {completionMonth} {startYear} to {completionMonth} {completionYear}.
      </Text>

      <Text style={styles.bodyText}>
        {pronounSubject} pursued a {duration}-Year Master of {programme} programme.
      </Text>

      <Text style={styles.bodyText}>
        {pronounSubject} duly graduated on {graduationDate} and was awarded a degree of Master of {programme}.
      </Text>

      <Text style={styles.bodyText}>
        {titleBody} {lastName} was consequently issued with a certificate number: {certificateNumber}.
      </Text>

      <Text style={styles.bodyText}>
        Any courtesies extended to {pronounObject} would be deeply appreciated.
      </Text>

      <Text style={styles.bodyText}>
        Yours sincerely,
      </Text>

      <View style={styles.signatureSection}>
        <Text style={styles.signatureName}>{signatory.name}</Text>
        <Text style={styles.signatureTitle}>{signatory.title}</Text>
        {signatory.for && <Text style={styles.signatureTitle}>{signatory.for}</Text>}
      </View>
    </Page>
  );
};

const AttestationPDF = ({ student }: { student: Student }) => {
  return (
    <Document>
      <AttestationPage student={student} />
    </Document>
  );
};

export default AttestationPDF;
