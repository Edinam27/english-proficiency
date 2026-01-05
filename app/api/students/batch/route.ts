import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const batchUpdateSchema = z.object({
  ids: z.array(z.coerce.number()), // DB IDs
  status: z.enum(['PENDING', 'PRINTED']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids, status } = batchUpdateSchema.parse(body);

    await prisma.student.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Batch update error:', error);
    return NextResponse.json(
      { error: 'Failed to update records' },
      { status: 500 }
    );
  }
}
