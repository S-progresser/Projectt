import { NextResponse } from 'next/server';
import { verifySuperAdminCredentials, createSuperAdminSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const isValid = verifySuperAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid master email or password' },
        { status: 401 }
      );
    }

    const session = createSuperAdminSession();

    const response = NextResponse.json({
      success: true,
      user: session.user,
      message: 'Superadmin authenticated successfully'
    });

    response.cookies.set('superadmin_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Server authentication error' },
      { status: 500 }
    );
  }
}
