import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { Student } from '@prisma/client';
import { SIGNATORIES } from '@/lib/constants';

// Register a font if we had a local file, but for now we use standard fonts.
// 'Times-Roman' is standard in PDF.
// Note: Times-Roman does not support bold/italic by default in some viewers without the specific font files, 
// but usually it works. 
// However, strictly speaking, we might want to register a font family if we want bold.
// For simplicity, we will use 'Times-Roman' and 'Times-Bold' which are standard PDF fonts.

export const styles = StyleSheet.create({
  page: {
    paddingTop: 120, // Approx 2 lines/space for letterhead (adjust as needed, usually letterhead is ~2 inches)
    paddingBottom: 60,
    paddingHorizontal: 50,
    fontFamily: 'Times-Roman',
    fontSize: 13,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'column',
    marginBottom: 20,
    fontFamily: 'Times-Roman',
    fontSize: 13,
    alignItems: 'flex-start',
  },
  refSection: {
    marginBottom: 0,
  },
  dateSection: {
    marginTop: 30, // Approx 2 lines spacing
    alignSelf: 'flex-end',
  },
  title: {
    fontFamily: 'Times-Bold',
    fontSize: 13,
    textAlign: 'left',
    textDecoration: 'underline',
    marginBottom: 20,
    marginTop: 20,
    hyphenation: false,
  },
  bodyText: {
    marginBottom: 15,
    textAlign: 'justify',
    fontFamily: 'Times-Roman',
    fontSize: 13,
    hyphenation: false,
  },
  signatureSection: {
    marginTop: 30,
  },
  signatureName: {
    fontFamily: 'Times-Roman',
    marginTop: 40, // Space for signature
  },
  signatureTitle: {
    fontFamily: 'Times-Bold',
  },
});

export const LetterPage = ({ student }: { student: Student }) => {
  const {
    firstName,
    otherNames,
    lastName,
    indexNumber,
    gender,
    completionMonth,
    completionYear,
    programme,
    duration,
    signatory: signatoryId,
  } = student;

  const signatory = SIGNATORIES.find(s => s.id === signatoryId) || SIGNATORIES[0];

  const formatName = (name: string | undefined | null) => (name || '').trim().replace(/\s+/g, '\u00A0');
  const fullName = `${formatName(firstName)} ${otherNames ? formatName(otherNames) + ' ' : ''}${formatName(lastName)}`;
  const titleHeader = gender === 'MALE' ? 'MR.' : 'MS.';
  const titleBody = gender === 'MALE' ? 'Mr.' : 'Ms.';
  const pronounPossessive = gender === 'MALE' ? 'his' : 'her';
  
  // Calculate Start Year
  const endYearInt = parseInt(completionYear, 10);
  // Use explicit admissionYear if available, otherwise fallback to calculation
  const startYear = student.admissionYear || (isNaN(endYearInt) ? 'UNKNOWN' : (endYearInt - duration).toString());
  
  // Current Date
  const today = new Date();
  
  // Ordinal Date Logic (Optional but nice)
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const day = today.getDate();
  const ordinalDate = `${getOrdinal(day)} ${today.toLocaleString('default', { month: 'long' })}, ${today.getFullYear()}`;


  return (
      <Page size="A4" style={styles.page}>
        {/* Ref and Date Section */}
        <View style={styles.header}>
          <View style={styles.refSection}>
            <Text>My Ref. No: AA/TA/{indexNumber}</Text>
            <Text>Your Ref. No:</Text>
          </View>
          <View style={styles.dateSection}>
            <Text>{ordinalDate}</Text>
          </View>
        </View>

        {/* Salutation */}
        <Text style={{ fontFamily: 'Times-Bold', marginBottom: 10, textAlign: 'left', textDecoration: 'underline' }}>
          {student.addressee || 'TO WHOM IT MAY CONCERN'}
        </Text>

        {/* Title */}
        <Text style={styles.title}>
          ENGLISH PROFICIENCY CERTIFICATE IN RESPECT OF{'\n'}{titleHeader} {fullName} (STUDENT{'\u00A0'}ID{'\u00A0'}NO:{'\u00A0'}{indexNumber})
        </Text>

        {/* Body Paragraph 1 */}
        <Text style={styles.bodyText}>
          This is to certify that {titleBody} {firstName} {otherNames} {lastName} was a bona fide student of the University of Professional Studies, Accra (UPSA) from {completionMonth} {startYear} to {completionMonth} {completionYear}.
        </Text>

        <Text style={styles.bodyText}>
          The official language and medium of instruction in all schools in Ghana is English. Therefore, {titleBody} {lastName} received all {pronounPossessive} instruction in English during {pronounPossessive} studies at UPSA.
        </Text>

        {/* Body Paragraph 2 */}
        <Text style={styles.bodyText}>
          All classes, assignments, oral and written examinations, seminars and extra-curricular activities that {titleBody} {lastName} participated in while pursuing {pronounPossessive} {duration}-Year Master of {programme} degree programme at UPSA were conducted in English.
        </Text>

        {/* Body Paragraph 3 */}
        <Text style={styles.bodyText}>
          As such, {titleBody} {lastName}, possesses the necessary aptitude to meet any English Language proficiency requirements set by your institution.
        </Text>

        <Text style={styles.bodyText}>
          Yours sincerely,
        </Text>

        {/* Signature */}
        <View style={styles.signatureSection}>
            {/* Space for signature image if needed, otherwise just text */}
            <Text style={styles.signatureName}>{signatory.name}</Text>
            <Text style={styles.signatureTitle}>{signatory.title}</Text>
            {signatory.for && <Text style={styles.signatureTitle}>{signatory.for}</Text>}
        </View>
      </Page>
  );
};

const LetterPDF = ({ student }: { student: Student }) => {
  return (
    <Document>
      <LetterPage student={student} />
    </Document>
  );
};

export default LetterPDF;
