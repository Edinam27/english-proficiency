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
  addresseeSection: {
    marginTop: 20,
    marginBottom: 20,
    fontFamily: 'Times-Bold',
  },
  title: {
    fontFamily: 'Times-Bold',
    fontSize: 12,
    textAlign: 'left',
    textDecoration: 'underline',
    marginBottom: 20,
    marginTop: 10,
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

export const IntroductoryPage = ({ student }: { student: Student }) => {
  const {
    firstName,
    otherNames,
    lastName,
    indexNumber,
    gender,
    programme,
    admissionYear,
    completionYear,
    currentLevel,
    purpose,
    addressee,
    signatory: signatoryId,
  } = student;

  // Default to Leticia if not specified
  const signatory = SIGNATORIES.find(s => s.id === signatoryId) || SIGNATORIES.find(s => s.id === 'LETICIA_AKYEAMPONG') || SIGNATORIES[0];

  const fullName = `${firstName} ${otherNames ? otherNames + ' ' : ''}${lastName}`;
  const titleHeader = gender === 'MALE' ? 'MR.' : 'MS.';
  const titleBody = gender === 'MALE' ? 'Mr.' : 'Ms.';
  const pronounSubject = gender === 'MALE' ? 'He' : 'She';
  const pronounObject = gender === 'MALE' ? 'him' : 'her';
  const pronounPossessive = gender === 'MALE' ? 'his' : 'her';

  const today = new Date();
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const day = today.getDate();
  const ordinalDate = `${getOrdinal(day)} ${today.toLocaleString('default', { month: 'long' })}, ${today.getFullYear()}`;

  // Ref No Logic
  const refPrefix = 'LA/ADM/UPSA';
  const refNo = `${refPrefix}.${indexNumber}`;

  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.refSection}>
          <Text>My Ref. No: {refNo}</Text>
        </View>
        <View style={styles.dateSection}>
          <Text>{ordinalDate}</Text>
        </View>
      </View>

      <View style={styles.addresseeSection}>
        <Text>{addressee}</Text>
      </View>

      <Text style={{ fontFamily: 'Times-Roman', marginBottom: 10 }}>Dear Sir/Madam,</Text>

      <Text style={styles.title}>
        LETTER OF INTRODUCTION IN RESPECT OF {titleHeader} {fullName.toUpperCase()}{'\n'}(ID:{'\u00A0'}{indexNumber})
      </Text>

      <Text style={styles.bodyText}>
        This is to introduce to you {titleBody} {fullName}, a {currentLevel} student at the University of Professional Studies, Accra (UPSA), who is pursuing a Master of {programme} degree programme.
      </Text>

      <Text style={styles.bodyText}>
        {titleBody} {lastName}, was admitted in {admissionYear} and will be completing in {completionYear}.
      </Text>

      <Text style={styles.bodyText}>
        {pronounSubject} has requested for an introductory letter as one of the required documents for {purpose}.
      </Text>

      <Text style={styles.bodyText}>
        It would be appreciated if {pronounSubject.toLowerCase()} could be accorded the necessary assistance.
      </Text>

      <Text style={styles.bodyText}>
        Thank you.
      </Text>

      <View style={styles.signatureSection}>
        <Text style={styles.signatureName}>{signatory.name}</Text>
        <Text style={styles.signatureTitle}>{signatory.title}</Text>
        {signatory.for && <Text style={styles.signatureTitle}>{signatory.for}</Text>}
      </View>
    </Page>
  );
};

const IntroductoryPDF = ({ student }: { student: Student }) => {
  return (
    <Document>
      <IntroductoryPage student={student} />
    </Document>
  );
};

export default IntroductoryPDF;
