import { NextResponse } from 'next/server';
import { getStudentsByInstitution, registerStudent } from '@/lib/studentsStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug') || 'bmsce';
  const students = getStudentsByInstitution(slug);
  return NextResponse.json({ students, count: students.length });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { institutionSlug, rollNo, name, email, department, section, semester, password, utrNumber, autoApprove } = body;

    if (!institutionSlug || !rollNo || !name || !email || !password || !utrNumber) {
      return NextResponse.json(
        { error: 'Missing required student registration or fee UTR fields.' },
        { status: 400 }
      );
    }

    const created = registerStudent({
      institutionSlug,
      rollNo,
      name,
      email,
      department: department || 'Computer Science & Engineering',
      section: section || 'Section A',
      semester: semester || 'Semester 1',
      password,
      utrNumber,
      autoApprove: !!autoApprove
    });

    return NextResponse.json({
      success: true,
      student: created,
      message: 'Student registered and fee payment submitted successfully.'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Server error during student registration & payment verification.' },
      { status: 500 }
    );
  }
}
