import React from 'react';
import { prisma } from '@/lib/db';
import BatchPDFPreview from '@/components/BatchPDFPreview';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function BatchPrintPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const params = await searchParams;
  const idsParam = params.ids;

  if (!idsParam) {
    return (
      <div className="p-8 text-center text-red-600">
        No students selected for printing.
      </div>
    );
  }

  const ids = idsParam.split(',').map(id => parseInt(id, 10)).filter(id => !isNaN(id));

  const students = await prisma.student.findMany({
    where: {
      id: {
        in: ids,
      },
    },
  });

  if (students.length === 0) {
    return (
      <div className="p-8 text-center text-red-600">
        No student records found for the selected IDs.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BatchPDFPreview students={students} />
    </div>
  );
}
