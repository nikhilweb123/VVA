import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import AboutContent from '@/models/AboutContent';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let about = await AboutContent.findOne({});
    if (!about) {
      about = await AboutContent.create({});
    }
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    return NextResponse.json({ error: 'Failed to fetch about content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    if (body.id) delete body.id;
    
    let about = await AboutContent.findOne({});
    if (!about) {
      about = await AboutContent.create(body);
    } else {
      about = await AboutContent.findByIdAndUpdate(about._id, body, { new: true, runValidators: true });
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
    return NextResponse.json({ error: 'Failed to update about content' }, { status: 500 });
  }
}
