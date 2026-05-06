import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import ContactSettings from '@/models/ContactSettings';

export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function GET() {
  try {
    await dbConnect();
    let settings = await ContactSettings.findOne({});
    if (!settings) {
      settings = await ContactSettings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching contact settings:', error);
    return NextResponse.json({ error: 'Failed to fetch contact settings' }, { status: 500 });
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

    let settings = await ContactSettings.findOne({});
    if (!settings) {
      settings = await ContactSettings.create(body);
    } else {
      settings = await ContactSettings.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating contact settings:', error);
    return NextResponse.json({ error: 'Failed to update contact settings' }, { status: 500 });
  }
}
