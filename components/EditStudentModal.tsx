'use client';

import React, { useState } from 'react';
import { Student } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PROGRAMMES, SIGNATORIES, getProgrammeDuration } from '@/lib/constants';

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  otherNames: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  programme: z.string().min(1, 'Programme is required'),
  addressee: z.string().min(1, 'Addressee is required'),
  signatory: z.string().min(1, 'Signatory is required'),
  
  // Proficiency fields
  completionYear: z.string().optional(),
  
  // Introductory fields
  admissionYear: z.string().optional(),
  currentLevel: z.string().optional(),
  purpose: z.string().optional(),
  
  // Attestation fields
  graduationDate: z.string().optional(),
  certificateNumber: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditStudentModalProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedStudent: Student) => void;
}

export default function EditStudentModal({ student, isOpen, onClose, onSave }: EditStudentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      firstName: student.firstName,
      otherNames: student.otherNames || '',
      lastName: student.lastName,
      programme: student.programme,
      addressee: student.addressee || 'TO WHOM IT MAY CONCERN',
      signatory: student.signatory || 'DENIS_ATTUQUAYEFIO',
      
      completionYear: student.completionYear || '',
      admissionYear: student.admissionYear || '',
      
      currentLevel: student.currentLevel || '',
      purpose: student.purpose || '',
      
      graduationDate: student.graduationDate || '',
      certificateNumber: student.certificateNumber || '',
    },
  });

  const selectedProgramme = watch('programme');

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate duration based on programme
      const duration = getProgrammeDuration(data.programme);
      const payload = {
        ...data,
        duration,
      };

      // Use student.id instead of indexNumber
      const response = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const updatedStudent = await response.json();
      onSave(updatedStudent);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const letterType = student.letterType || 'PROFICIENCY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 my-8">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Edit {letterType} Request: {student.indexNumber}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">Close</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Common Fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                {...register('firstName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Other Names</label>
              <input
                {...register('otherNames')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                {...register('lastName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Programme</label>
              <select
                {...register('programme')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">Select Programme</option>
                {PROGRAMMES.map((prog) => (
                  <option key={prog} value={prog}>
                    {prog}
                  </option>
                ))}
              </select>
              {errors.programme && <p className="text-red-500 text-xs mt-1">{errors.programme.message}</p>}
            </div>

            {/* Proficiency & Attestation Specific */}
            {(letterType === 'PROFICIENCY' || letterType === 'ATTESTATION') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Year Started</label>
                  <input
                    {...register('admissionYear')}
                    placeholder="YYYY"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                  {errors.admissionYear && <p className="text-red-500 text-xs mt-1">{errors.admissionYear.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Year Completed</label>
                  <input
                    {...register('completionYear')}
                    placeholder="YYYY"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                  {errors.completionYear && <p className="text-red-500 text-xs mt-1">{errors.completionYear.message}</p>}
                </div>
              </>
            )}

            {/* Introductory Specific */}
            {letterType === 'INTRODUCTORY' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Admission Year</label>
                  <input
                    {...register('admissionYear')}
                    placeholder="e.g. August 2024"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Level</label>
                  <input
                    {...register('currentLevel')}
                    placeholder="e.g. Second-Year"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Purpose</label>
                  <input
                    {...register('purpose')}
                    placeholder="e.g. Visa application"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </>
            )}

            {/* Attestation Specific */}
            {letterType === 'ATTESTATION' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Graduation Date</label>
                  <input
                    {...register('graduationDate')}
                    placeholder="e.g. 30th August, 2022"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Certificate Number</label>
                  <input
                    {...register('certificateNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Addressee</label>
              <textarea
                {...register('addressee')}
                rows={6}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
              {errors.addressee && <p className="text-red-500 text-xs mt-1">{errors.addressee.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Signatory</label>
              <select
                {...register('signatory')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              >
                <option value="">Select Signatory</option>
                {SIGNATORIES.map((s) => (
                   <option key={s.id} value={s.id}>
                     {s.name}
                   </option>
                ))}
              </select>
              {errors.signatory && <p className="text-red-500 text-xs mt-1">{errors.signatory.message}</p>}
            </div>

          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
