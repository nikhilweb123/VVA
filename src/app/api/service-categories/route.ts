import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import ServiceCategory from '@/models/ServiceCategory';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const categories = await ServiceCategory.find({}).sort({ name: 1 });
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return NextResponse.json({ error: 'Failed to fetch service categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    if (body.id) delete body.id;

    const category = await ServiceCategory.create(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating service category:', error);
    return NextResponse.json({ error: 'Failed to create service category' }, { status: 500 });
  }
}
