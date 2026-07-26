import { NextResponse } from 'next/server';
import { getTeachersByInstitution, registerTeacher } from '@/lib/teachersStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'bmsce';
  const teachers = getTeachersByInstitution(slug);
  return NextResponse.json({ teachers, count: teachers.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { institutionSlug, teacherId, name, email, department, designation, password } = body;

    if (!institutionSlug || !teacherId || !name || !email || !password) {
      return NextResponse.json(
        { error: 'Missing required teacher registration fields.' },
        { status: 400 }
      );
    }

    const created = registerTeacher({
      institutionSlug,
      teacherId,
      name,
      email,
      department: department || 'General Academics',
      designation: designation || 'Assistant Professor',
      password,
      status: 'PENDING'
    });

    return NextResponse.json({
      success: true,
      teacher: created,
      message: 'Teacher registered successfully and submitted for Institution Admin approval.'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error registering teacher.' },
      { status: 500 }
    );
  }
}
