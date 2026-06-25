import { NextResponse } from 'next/server';
import { readDatabaseAsync, writeDatabaseAsync } from '@/database/db';
import { getUserIdFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const userId = await getUserIdFromRequest(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
  }
  const db = await readDatabaseAsync(userId);
  return NextResponse.json(db.progress);
}

export async function POST(request: Request) {
  try {
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized. Valid auth token required.' }, { status: 401 });
    }
    const body = await request.json();
    const db = await readDatabaseAsync(userId);
    
    db.progress = {
      xp: body.xp ?? db.progress.xp,
      streak: body.streak ?? db.progress.streak,
      completedProblems: body.completedProblems ?? db.progress.completedProblems,
      unlockedAchievements: body.unlockedAchievements ?? db.progress.unlockedAchievements,
      lastActiveDate: body.lastActiveDate ?? db.progress.lastActiveDate
    };
    
    await writeDatabaseAsync(db, userId);
    return NextResponse.json({ success: true, progress: db.progress });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid body or error saving progress' }, { status: 400 });
  }
}
