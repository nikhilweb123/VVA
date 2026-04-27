import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enquiry from '@/models/Enquiry';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const enquiries = await Enquiry.find({}).sort({ createdAt: -1 });
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (body.id) delete body.id;
    
    const newEnquiry = await Enquiry.create(body);

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to add enquiry' }, { status: 500 });
  }
}
