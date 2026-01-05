'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            UPSA Graduate School
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Letter Request Portal
          </p>
          <p className="mt-2 text-gray-600">Please select the type of letter you wish to request.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Proficiency Letter Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">English Proficiency Letter</h3>
              <p className="text-sm text-gray-500 mb-6">
                Request a letter confirming that your medium of instruction was English.
              </p>
              <Link
                href="/proficiency"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
              >
                Request Proficiency
              </Link>
            </div>
          </div>

          {/* Introductory Letter Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Introductory Letter</h3>
              <p className="text-sm text-gray-500 mb-6">
                Request an introductory letter for visa applications or other official purposes.
              </p>
              <Link
                href="/introductory"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
              >
                Request Introductory
              </Link>
            </div>
          </div>

          {/* Attestation Letter Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
            <div className="px-4 py-5 sm:p-6 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Attestation Letter</h3>
              <p className="text-sm text-gray-500 mb-6">
                Request an attestation letter confirming your completion of studies.
              </p>
              <Link
                href="/attestation"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full"
              >
                Request Attestation
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
            <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                Officer Login
            </Link>
        </div>
      </div>
    </main>
  );
}
