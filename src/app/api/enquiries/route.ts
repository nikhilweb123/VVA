import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import Enquiry from '@/models/Enquiry';
import ContactSettings from '@/models/ContactSettings';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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

    // Send notification to recipientEmail if configured.
    // Integrate an email provider (e.g. Resend, Nodemailer) here:
    //   const settings = await ContactSettings.findOne({});
    //   if (settings?.recipientEmail) { await sendEmail(...) }
    void ContactSettings; // referenced so the import is kept

    return NextResponse.json(newEnquiry, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json({ error: 'Failed to add enquiry' }, { status: 500 });
  }
}
