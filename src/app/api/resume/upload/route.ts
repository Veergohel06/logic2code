import { NextResponse } from 'next/server';
import { PDFParse } from 'pdf-parse';
import { getUserIdFromRequest } from '@/lib/auth';

if (typeof global !== 'undefined') {
  const globalAny = global as any;
  if (!globalAny.DOMMatrix) globalAny.DOMMatrix = class DOMMatrix {};
  if (!globalAny.ImageData) globalAny.ImageData = class ImageData {};
  if (!globalAny.Path2D) globalAny.Path2D = class Path2D {};
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export async function POST(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size limit exceeded (Max 2MB).' }, { status: 413 });
    }

    if (file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Only PDF documents are allowed.' }, { status: 415 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();

    return NextResponse.json({
      success: true,
      resumeText: data.text || ''
    });
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    return NextResponse.json({ error: 'Failed to parse resume.' }, { status: 500 });
  }
}
