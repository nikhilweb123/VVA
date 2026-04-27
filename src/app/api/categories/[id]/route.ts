import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'categories.json');

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const fileContent = await fs.readFile(dataFilePath, 'utf8');
    const categories = JSON.parse(fileContent);

    const filteredCategories = categories.filter((cat: any) => cat.id !== id);

    await fs.writeFile(dataFilePath, JSON.stringify(filteredCategories, null, 2), 'utf8');

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
