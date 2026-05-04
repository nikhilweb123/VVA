import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function isAuthenticated() {
  const cookieStore = await cookies();
  return cookieStore.get('admin_session')?.value === 'true';
}

export async function POST(request: Request) {
  if (!await isAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch (e: any) {
    console.error('formData parse error:', e);
    return NextResponse.json({ error: `Failed to parse form data: ${e?.message}` }, { status: 400 });
  }

  const file = formData.get('file') as File | null;

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' },
      { status: 400 }
    );
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
  }

  try {
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    await fs.mkdir(uploadsDir, { recursive: true });

    const timestamp = Date.now();
    const ext = path.extname(file.name || '.jpg').toLowerCase() || '.jpg';
    const filename = `project-${timestamp}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    const bytes = await file.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(bytes));

    return NextResponse.json(
      { success: true, url: `/uploads/projects/${filename}`, filename },
      { status: 201 }
    );
  } catch (e: any) {
    console.error('Upload write error:', e);
    return NextResponse.json({ error: `Upload failed: ${e?.message}` }, { status: 500 });
  }
}
