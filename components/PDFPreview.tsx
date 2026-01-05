'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Student } from '@prisma/client';

const PDFViewer = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading PDF Viewer...</p>,
  }
);

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <button className="btn">Loading Download...</button>,
  }
);

import LetterPDF from './LetterPDF';
import IntroductoryPDF from './IntroductoryPDF';
import AttestationPDF from './AttestationPDF';

export default function PDFPreview({ student }: { student: Student }) {
  const fileName = `${student.firstName}${student.otherNames ? '_' + student.otherNames : ''}_${student.lastName}_${student.indexNumber}.pdf`.replace(/\s+/g, '_');

  const getDocument = () => {
    switch (student.letterType) {
      case 'INTRODUCTORY':
        return <IntroductoryPDF student={student} />;
      case 'ATTESTATION':
        return <AttestationPDF student={student} />;
      case 'PROFICIENCY':
      default:
        return <LetterPDF student={student} />;
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 w-full h-full">
      <div className="w-full max-w-4xl flex justify-end">
        <PDFDownloadLink
          document={getDocument()}
          fileName={fileName}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Generating PDF...' : 'Download PDF'
          }
        </PDFDownloadLink>
      </div>
      
      <div className="w-full h-[800px] border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%" className="w-full h-full">
          {getDocument()}
        </PDFViewer>
      </div>
    </div>
  );
}
