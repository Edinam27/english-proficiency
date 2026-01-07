'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { PROGRAMMES, getProgrammeDuration } from '@/lib/constants';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  otherNames: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  indexNumber: z.string().min(1, 'Index number is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  programme: z.string().min(1, 'Programme is required'),
  completionYear: z.string().regex(/^\d{4}$/, 'Year must be 4 digits'),
  duration: z.coerce.number().min(1).max(5).optional(),
  graduationDate: z.string().min(1, 'Graduation date is required'),
  certificateNumber: z.string().min(1, 'Certificate number is required'),
});

type FormData = z.infer<typeof formSchema>;

export default function AttestationRequest() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      gender: 'MALE',
      programme: PROGRAMMES[0],
      duration: 2,
    },
  });

  const selectedProgramme = watch('programme');

  React.useEffect(() => {
    if (selectedProgramme) {
      const duration = getProgrammeDuration(selectedProgramme);
      setValue('duration', duration);
    }
  }, [selectedProgramme, setValue]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...data,
        letterType: 'ATTESTATION',
        // Default values
        completionMonth: 'August', 
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

      setSuccess('Your attestation letter request has been submitted successfully. Please contact the School Officer for your letter.');
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
          <h1 className="text-3xl font-bold text-gray-900">Attestation Letter Request</h1>
          <p className="mt-2 text-gray-600">School of Graduate Studies (Graduated Students)</p>
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

            <div>
              <label htmlFor="completionYear" className="block text-sm font-medium text-gray-700">Completion Year</label>
              <input
                {...register('completionYear')}
                type="text"
                placeholder="2025"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.completionYear && <p className="mt-1 text-sm text-red-600">{errors.completionYear.message}</p>}
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (Years)
              </label>
              <select
                id="duration"
                {...register('duration')}
                className="mt-1 block w-full border border-gray-400 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 bg-white"
              >
                {[1, 2, 3, 4, 5].map((year) => (
                  <option key={year} value={year}>
                    {year} Year{year > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
              {errors.duration && (
                <p className="mt-2 text-sm text-red-600">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="graduationDate" className="block text-sm font-medium text-gray-700">Graduation Date</label>
              <input
                {...register('graduationDate')}
                type="text"
                placeholder="e.g. 25th July, 2024"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.graduationDate && <p className="mt-1 text-sm text-red-600">{errors.graduationDate.message}</p>}
            </div>

            <div>
              <label htmlFor="certificateNumber" className="block text-sm font-medium text-gray-700">Certificate Number</label>
              <input
                {...register('certificateNumber')}
                type="text"
                placeholder="e.g. 12345678"
                className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 text-gray-900 bg-white"
              />
              {errors.certificateNumber && <p className="mt-1 text-sm text-red-600">{errors.certificateNumber.message}</p>}
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
              {isSubmitting ? 'Processing...' : 'Request Attestation Letter'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
