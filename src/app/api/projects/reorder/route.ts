import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

// Body: { ids: string[], miscIds: string[] }
// ids = ordered list of regular project IDs
// miscIds = ordered list of miscellaneous project IDs
export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { ids = [], miscIds = [] }: { ids: string[]; miscIds: string[] } = await request.json();

    const bulkOps = [
      ...ids.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      })),
      ...miscIds.map((id, index) => ({
        updateOne: {
          filter: { _id: id },
          update: { $set: { order: index } },
        },
      })),
    ];

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return NextResponse.json({ error: 'Failed to reorder projects' }, { status: 500 });
  }
}
