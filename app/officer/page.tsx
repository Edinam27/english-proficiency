import React from 'react';
import { prisma } from '@/lib/db';
import OfficerDashboard from '@/components/OfficerDashboard';
import LogoutButton from '@/components/LogoutButton';

// Although middleware protects this, good to double check or get user info if needed
// But middleware ensures token presence.

export const dynamic = 'force-dynamic';

export default async function OfficerPage() {
  // Fetch pending students
  const students = await prisma.student.findMany({
    where: {
      status: 'PENDING',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Officer Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Logged in as Officer</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <OfficerDashboard students={students} />
        </div>
      </main>
    </div>
  );
}
