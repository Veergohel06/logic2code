import { supabase } from '@/database/supabaseClient';

export async function getUserIdFromRequest(request: Request): Promise<string | undefined> {
  if (!supabase) return undefined;
  
  let token = '';
  
  // 1. Check Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader) {
    token = authHeader.replace('Bearer ', '').trim();
  }
  
  // 2. Check query parameters
  if (!token) {
    const url = new URL(request.url);
    token = (url.searchParams.get('token') || url.searchParams.get('access_token') || '').trim();
  }
  
  if (!token) return undefined;

  // Development/fallback mode token bypass for mock user
  if (token === 'dev-token') {
    return '00000000-0000-0000-0000-000000000000';
  }

  try {
    const { data: { user } } = await supabase.auth.getUser(token);
    return user?.id || undefined;
  } catch (err) {
    console.error('Error verifying auth token:', err);
    return undefined;
  }
}
