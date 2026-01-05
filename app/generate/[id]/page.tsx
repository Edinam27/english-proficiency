import React from 'react';
import { prisma } from '@/lib/db';
import PDFPreview from '@/components/PDFPreview';
import Link from 'next/link';

// Ensure the page is dynamic
export const dynamic = 'force-dynamic';

export default async function GeneratePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Use try-catch to handle DB connection errors gracefully (e.g. if env var is missing)
  let student = null;
  let error = null;

  try {
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      throw new Error("Invalid student ID");
    }
    student = await prisma.student.findUnique({
      where: { id: studentId },
    });
  } catch (e) {
    console.error(e);
    error = "Failed to connect to database or find student.";
  }

  if (error || !student) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-gray-700 mb-8">{error || "Student not found."}</p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-800 underline">
          Go back to Home
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Letter Preview: {student.firstName} {student.lastName}
          </h1>
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            &larr; Create Another
          </Link>
        </div>
        
        <PDFPreview student={student} />
      </div>
    </main>
  );
}
