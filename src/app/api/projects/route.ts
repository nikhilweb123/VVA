import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';
import Project from '@/models/Project';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    // Remove ID if present in body as MongoDB generates it
    if (body.id) delete body.id;

    // Assign order = current count so new projects go to the end
    const count = await Project.countDocuments({});
    if (body.order === undefined) body.order = count;

    const newProject = await Project.create(body);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}
