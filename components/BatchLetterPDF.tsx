import React from 'react';
import { Document } from '@react-pdf/renderer';
import { Student } from '@prisma/client';
import { LetterPage } from './LetterPDF';
import { IntroductoryPage } from './IntroductoryPDF';
import { AttestationPage } from './AttestationPDF';

const BatchLetterPDF = ({ students }: { students: Student[] }) => {
  return (
    <Document>
      {students.map((student) => {
        switch (student.letterType) {
          case 'INTRODUCTORY':
            return <IntroductoryPage key={student.id} student={student} />;
          case 'ATTESTATION':
            return <AttestationPage key={student.id} student={student} />;
          case 'PROFICIENCY':
          default:
            return <LetterPage key={student.id} student={student} />;
        }
      })}
    </Document>
  );
};

export default BatchLetterPDF;
