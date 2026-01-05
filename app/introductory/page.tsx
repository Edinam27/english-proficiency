'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { PROGRAMMES } from '@/lib/constants';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  otherNames: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  indexNumber: z.string().min(1, 'Index number is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  programme: z.string().min(1, 'Programme is required'),
  addressee: z.string().min(1, 'Address To is required'),
  admissionYear: z.string().min(1, 'Admission year is required'),
  currentLevel: z.string().min(1, 'Current level is required'),
  purpose: z.string().min(1, 'Purpose is required'),
  completionYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'), // Required by DB schema
});

type FormData = z.infer<typeof formSchema>;

export default function IntroductoryRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gender: 'MALE',
      programme: PROGRAMMES[0],
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...data,
        letterType: 'INTRODUCTORY',
        // Default values for fields not in this form but required by schema or logic
        completionMonth: 'August', 
        duration: 2, 
      };

      const response = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save data');
      }

      setSuccess('Your introductory letter request has been submitted successfully. Please contact the School Officer for your letter.');
      reset();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Introductory Letter Request</h1>
          <p className="mt-2 text-gray-600">School of Graduate Studies</p>
        </div>

        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 text-green-700 bg-green-100 rounded-md">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                {...register('firstName')}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="otherNames" className="block text-sm font-medium text-gray-700">Other Names</label>
              <input
                {...register('otherNames')}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                {...register('lastName')}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
            </div>

            <div>
              <label htmlFor="indexNumber" className="block text-sm font-medium text-gray-700">Index Number (ID)</label>
              <input
                {...register('indexNumber')}
                type="text"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.indexNumber && <p className="mt-1 text-sm text-red-600">{errors.indexNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                {...register('gender')}
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="addressee" className="block text-sm font-medium text-gray-700">Address To (e.g. The Consular Section, US Embassy)</label>
              <input
                {...register('addressee')}
                type="text"
                placeholder="e.g. The Consular Section, Embassy of the United States, Accra"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.addressee && <p className="mt-1 text-sm text-red-600">{errors.addressee.message}</p>}
            </div>

            <div>
              <label htmlFor="admissionYear" className="block text-sm font-medium text-gray-700">Admission Year</label>
              <input
                {...register('admissionYear')}
                type="text"
                placeholder="e.g. 2023"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.admissionYear && <p className="mt-1 text-sm text-red-600">{errors.admissionYear.message}</p>}
            </div>

            <div>
              <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700">Current Level</label>
              <input
                {...register('currentLevel')}
                type="text"
                placeholder="e.g. Level 600 / Second Year"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.currentLevel && <p className="mt-1 text-sm text-red-600">{errors.currentLevel.message}</p>}
            </div>
            
             <div>
              <label htmlFor="completionYear" className="block text-sm font-medium text-gray-700">Expected Completion Year</label>
              <input
                {...register('completionYear')}
                type="text"
                placeholder="2025"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.completionYear && <p className="mt-1 text-sm text-red-600">{errors.completionYear.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Purpose of Letter</label>
              <input
                {...register('purpose')}
                type="text"
                placeholder="e.g. Visa Application"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.purpose && <p className="mt-1 text-sm text-red-600">{errors.purpose.message}</p>}
            </div>

          </div>

          <div className="col-span-full">
            <label htmlFor="programme" className="block text-sm font-medium text-gray-700">Master's Programme Name</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-400 bg-gray-50 px-3 text-gray-900 sm:text-sm">
                Master of
              </span>
              <select
                {...register('programme')}
                className="block w-full flex-1 rounded-none rounded-r-md border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              >
                {PROGRAMMES.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
            </div>
            {errors.programme && <p className="mt-1 text-sm text-red-600">{errors.programme.message}</p>}
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Request Introductory Letter'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
