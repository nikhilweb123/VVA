import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import TeamMember from '@/models/TeamMember';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const members = await TeamMember.find({}).sort({ order: 1, createdAt: 1 });
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    if (body.id) delete body.id;
    const member = await TeamMember.create(body);
    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ error: 'Failed to create team member' }, { status: 500 });
  }
}
