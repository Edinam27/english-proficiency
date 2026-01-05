'use client';

import React, { useState, useMemo } from 'react';
import { Student } from '@prisma/client';
import { useRouter } from 'next/navigation';
import EditStudentModal from './EditStudentModal';

export default function OfficerDashboard({ students: initialStudents }: { students: Student[] }) {
  const router = useRouter();
  const [students, setStudents] = useState(initialStudents);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ALL'>('PENDING');
  const [activeType, setActiveType] = useState<'ALL' | 'PROFICIENCY' | 'INTRODUCTORY' | 'ATTESTATION'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sync with prop updates if they happen (e.g. router.refresh)
  React.useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  const stats = useMemo(() => {
    return {
      totalPending: students.filter(s => s.status === 'PENDING').length,
      proficiencyPending: students.filter(s => s.status === 'PENDING' && s.letterType === 'PROFICIENCY').length,
      introductoryPending: students.filter(s => s.status === 'PENDING' && s.letterType === 'INTRODUCTORY').length,
      attestationPending: students.filter(s => s.status === 'PENDING' && s.letterType === 'ATTESTATION').length,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesTab = activeTab === 'ALL' || s.status === 'PENDING';
      const matchesType = activeType === 'ALL' || s.letterType === activeType;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        s.indexNumber.toLowerCase().includes(searchLower) ||
        s.firstName.toLowerCase().includes(searchLower) ||
        s.lastName.toLowerCase().includes(searchLower) ||
        (s.otherNames && s.otherNames.toLowerCase().includes(searchLower)) ||
        s.programme.toLowerCase().includes(searchLower);
      
      return matchesTab && matchesType && matchesSearch;
    });
  }, [students, activeTab, activeType, searchQuery]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === filteredStudents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStudents.map((s) => s.id.toString()));
    }
  };

  const handlePrint = () => {
    if (selectedIds.length === 0) return;
    const url = `/officer/print?ids=${selectedIds.join(',')}`;
    window.open(url, '_blank');
  };

  const handleMarkAsPrinted = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm('Mark selected letters as PRINTED?')) return;

    setIsUpdating(true);
    try {
      const res = await fetch('/api/students/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status: 'PRINTED' }),
      });

      if (res.ok) {
        router.refresh(); 
        setSelectedIds([]);
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveStudent = (updatedStudent: Student) => {
    setStudents((prev) => 
      prev.map((s) => s.id === updatedStudent.id ? updatedStudent : s)
    );
    router.refresh();
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Pending Requests</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalPending}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Proficiency Pending</dt>
            <dd className="mt-1 text-3xl font-semibold text-indigo-600">{stats.proficiencyPending}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Introductory Pending</dt>
            <dd className="mt-1 text-3xl font-semibold text-green-600">{stats.introductoryPending}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Attestation Pending</dt>
            <dd className="mt-1 text-3xl font-semibold text-purple-600">{stats.attestationPending}</dd>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Header & Tabs */}
        <div className="mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Officer Dashboard
              </h2>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab('PENDING')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'PENDING'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'ALL'
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  All Records
                </button>
              </div>
            </div>

            {/* Type Filters */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
              {[
                { id: 'ALL', label: 'All Types' },
                { id: 'PROFICIENCY', label: 'Proficiency' },
                { id: 'INTRODUCTORY', label: 'Introductory' },
                { id: 'ATTESTATION', label: 'Attestation' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setActiveType(type.id as any)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                    activeType === type.id
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or index..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex space-x-3 w-full sm:w-auto">
             <button
              onClick={handlePrint}
              disabled={selectedIds.length === 0}
              className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
            >
              Print ({selectedIds.length})
            </button>
            {activeTab === 'PENDING' && (
              <button
                onClick={handleMarkAsPrinted}
                disabled={selectedIds.length === 0 || isUpdating}
                className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm"
              >
                {isUpdating ? '...' : 'Mark Printed'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                  onChange={toggleAll}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-400 rounded"
                />
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Index / Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programme
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Addressee
              </th>
               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-500">
                  No records found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id} className={selectedIds.includes(student.id.toString()) ? 'bg-indigo-50' : 'hover:bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(student.id.toString())}
                      onChange={() => toggleSelection(student.id.toString())}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-400 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{student.indexNumber}</div>
                    <div className="text-sm text-gray-500">{student.firstName} {student.otherNames} {student.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.letterType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {student.programme}
                    <div className="text-xs text-gray-400">{student.completionYear}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {student.addressee}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      student.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingStudent(student)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          onSave={handleSaveStudent}
        />
      )}
    </div>
  </div>
  );
}
