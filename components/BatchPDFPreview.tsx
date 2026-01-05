'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Student } from '@prisma/client';
import BatchLetterPDF from './BatchLetterPDF';

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

export default function BatchPDFPreview({ students }: { students: Student[] }) {
  const fileName = `Batch_Letters_${new Date().toISOString().slice(0, 10)}.pdf`;

  return (
    <div className="flex flex-col items-center space-y-4 w-full h-full p-4">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-xl font-bold">Batch Print Preview ({students.length} letters)</h1>
        <PDFDownloadLink
          document={<BatchLetterPDF students={students} />}
          fileName={fileName}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {({ blob, url, loading, error }) =>
            loading ? 'Generating Batch PDF...' : 'Download Batch PDF'
          }
        </PDFDownloadLink>
      </div>
      
      <div className="w-full h-[800px] border border-gray-200 shadow-lg rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%" className="w-full h-full">
          <BatchLetterPDF students={students} />
        </PDFViewer>
      </div>
    </div>
  );
}
