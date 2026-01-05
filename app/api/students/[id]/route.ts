import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  otherNames: z.string().optional(),
  lastName: z.string().min(1).optional(),
  programme: z.string().min(1).optional(),
  completionYear: z.string().optional(),
  addressee: z.string().min(1).optional(),
  duration: z.number().min(1).max(5).optional(),
  signatory: z.string().min(1).optional(),
  
  // New fields
  admissionYear: z.string().optional(),
  currentLevel: z.string().optional(),
  purpose: z.string().optional(),
  graduationDate: z.string().optional(),
  certificateNumber: z.string().optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate body
    const validatedData = updateSchema.parse(body);

    const student = await prisma.student.update({
      where: { id: parseInt(id) },
      data: validatedData,
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error('Error updating student:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update student' },
      { status: 500 }
    );
  }
}
