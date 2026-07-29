// Teacher & Staff Data Store per Institution

export const INITIAL_TEACHERS = [
  {
    id: 'tch-201',
    institutionSlug: 'grgarts',
    institutionCode: 'GRG-INDI-01',
    teacherId: 'EMP-GRG-201',
    name: 'Dr. B. M. Patil',
    email: 'principal@grgindi.edu.in',
    department: 'English & Literature',
    designation: 'Principal & HOD',
    phone: '+91 98451 99887',
    status: 'APPROVED',
    password: 'Teacher#123',
    createdAt: '2026-02-12T09:00:00.000Z',
    assignedCourses: [
      { id: 'crs-101', code: '24BA4ENG03', title: 'ADVANCED ENGLISH LITERATURE', semester: 'SEM 04', totalStudents: 70 }
    ]
  },
  {
    id: 'tch-202',
    institutionSlug: 'grgarts',
    institutionCode: 'GRG-INDI-01',
    teacherId: 'EMP-GRG-202',
    name: 'Prof. S. S. Biradar',
    email: 'biradar.commerce@grgindi.edu.in',
    department: 'Commerce',
    designation: 'Head of Commerce Dept',
    phone: '+91 97412 88776',
    status: 'APPROVED',
    password: 'Teacher#123',
    createdAt: '2026-02-14T10:30:00.000Z',
    assignedCourses: [
      { id: 'crs-102', code: '24BC4ACC01', title: 'CORPORATE ACCOUNTING & AUDITING', semester: 'SEM 04', totalStudents: 70 }
    ]
  }
];

const LOCAL_STORAGE_KEY = 'teachers_store_v1';

export function getTeachers() {
  if (typeof window === 'undefined') return INITIAL_TEACHERS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
      return INITIAL_TEACHERS;
    }
    const parsed = JSON.parse(data);
    const grgOnly = (parsed || []).filter(t => t.institutionSlug === 'grgarts' || t.institutionCode === 'GRG-INDI-01');
    const result = grgOnly.length > 0 ? grgOnly : INITIAL_TEACHERS;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(result));
    return result;
  } catch (e) {
    console.error('Error reading teachers store', e);
    return INITIAL_TEACHERS;
  }
}

export function saveTeachers(teachers) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(teachers));
    } catch (e) {
      console.error('Error saving teachers store', e);
    }
  }
}

export function getTeachersByInstitution(slug) {
  const teachers = getTeachers();
  const clean = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return teachers.filter(t => {
    const tSlug = (t.institutionSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const tCode = (t.institutionCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if ((clean.includes('grg') || clean.includes('indi') || clean.includes('yap')) && 
        (tSlug.includes('grg') || tCode.includes('grg'))) {
      return true;
    }
    return tSlug === clean || tCode === clean || tSlug.includes(clean) || clean.includes(tSlug);
  });
}

export function registerTeacher(teacherData) {
  const teachers = getTeachers();
  const newTeacher = {
    id: `tch-${Date.now()}`,
    institutionSlug: teacherData.institutionSlug,
    institutionCode: teacherData.institutionCode || teacherData.institutionSlug.toUpperCase(),
    teacherId: teacherData.teacherId.trim().toUpperCase(),
    name: teacherData.name.trim(),
    email: teacherData.email.trim().toLowerCase(),
    department: teacherData.department.trim(),
    designation: teacherData.designation.trim(),
    phone: teacherData.phone || '+91 90000 00000',
    status: teacherData.status || 'PENDING',
    password: teacherData.password,
    createdAt: new Date().toISOString(),
    assignedCourses: [
      { id: `crs-${Date.now()}`, code: 'CS-101', title: 'Intro to Computer Science', semester: 'Semester 1', totalStudents: 45 }
    ]
  };

  const updated = [newTeacher, ...teachers];
  saveTeachers(updated);
  return newTeacher;
}

export function approveTeacher(id) {
  const teachers = getTeachers();
  const updated = teachers.map(t => t.id === id ? { ...t, status: 'APPROVED' } : t);
  saveTeachers(updated);
  return updated;
}

export function rejectTeacher(id) {
  const teachers = getTeachers();
  const updated = teachers.map(t => t.id === id ? { ...t, status: 'REJECTED' } : t);
  saveTeachers(updated);
  return updated;
}

export function verifyTeacherLogin(slug, email, password) {
  const teachers = getTeachersByInstitution(slug);
  const found = teachers.find(
    t => t.email.toLowerCase() === email.trim().toLowerCase() && t.password === password
  );

  if (!found) return { success: false, error: 'Invalid teacher email or password.' };
  if (found.status === 'PENDING') {
    return { success: false, error: 'Your account registration is pending approval by the Institution Admin.' };
  }
  if (found.status === 'REJECTED') {
    return { success: false, error: 'Your faculty account application was not approved.' };
  }

  return { success: true, teacher: found };
}
