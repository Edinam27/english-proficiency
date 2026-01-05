import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const studentSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  otherNames: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  indexNumber: z.string().min(1, 'Index number is required'),
  gender: z.enum(['MALE', 'FEMALE']),
  programme: z.string().min(1, 'Programme is required'),
  
  // Defaults and Optionals
  completionMonth: z.string().default('August'),
  completionYear: z.string().default(new Date().getFullYear().toString()),
  duration: z.number().default(2),
  addressee: z.string().optional(),
  
  letterType: z.enum(['PROFICIENCY', 'INTRODUCTORY', 'ATTESTATION']).default('PROFICIENCY'),
  
  // Intro fields
  admissionYear: z.string().optional(),
  currentLevel: z.string().optional(),
  purpose: z.string().optional(),
  
  // Attestation fields
  graduationDate: z.string().optional(),
  certificateNumber: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = studentSchema.parse(body);

    // Check if student request for this type already exists
    const existingStudent = await prisma.student.findFirst({
      where: { 
        indexNumber: validatedData.indexNumber,
        letterType: validatedData.letterType
      },
    });

    if (existingStudent) {
      // Update existing and reset status to PENDING
      const updatedStudent = await prisma.student.update({
        where: { id: existingStudent.id },
        data: {
          ...validatedData,
          status: 'PENDING',
        },
      });
      return NextResponse.json(updatedStudent);
    }

    const newStudent = await prisma.student.create({
      data: validatedData,
    });

    return NextResponse.json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json(
      { error: 'Failed to create student record' },
      { status: 500 }
    );
  }
}
