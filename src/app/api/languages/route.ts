import { NextResponse } from 'next/server';
import { readDatabaseAsync, writeDatabaseAsync } from '@/database/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
  }
  const db = await readDatabaseAsync(userId);
  return NextResponse.json(db.profile);
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
    }
    const body = await request.json();
    const db = await readDatabaseAsync(userId);
    
    if (body.preferred_language !== undefined) {
      db.profile.preferred_language = body.preferred_language;
    }
    if (body.career_goal !== undefined) {
      db.profile.career_goal = body.career_goal;
    }
    if (body.experience_level !== undefined) {
      db.profile.experience_level = body.experience_level;
    }
    if (body.display_name !== undefined) {
      db.profile.display_name = body.display_name;
    }
    if (body.avatar_id !== undefined) {
      db.profile.avatar_id = body.avatar_id;
    }
    
    await writeDatabaseAsync(db, userId);
    return NextResponse.json({ success: true, ...db.profile });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body or error saving profile details' }, { status: 400 });
  }
}
