// Student & Fee Payment Data Store per Institution

const FIRST_NAMES = ['Aarav', 'Ananya', 'Bhuvan', 'Diya', 'Eshwar', 'Farhan', 'Gautam', 'Harini', 'Ishaan', 'Janani', 'Kavya', 'Lohith', 'Meera', 'Nikhil', 'Ojas', 'Pranav', 'Qasim', 'Rohan', 'Sneha', 'Tanvi', 'Utkarsh', 'Varun', 'Yash', 'Zoya', 'Aditya', 'Bhavana', 'Chaitanya', 'Deepika', 'Esha', 'Girish'];
const LAST_NAMES = ['Sharma', 'Kulkarni', 'Deshmukh', 'Gowda', 'Reddy', 'Patel', 'Nair', 'Iyer', 'Joshi', 'Rao', 'Verma', 'Singh', 'Bhat', 'Hegde', 'Mehta', 'Gupta', 'Shetty', 'Pillai', 'Menon', 'Chatterjee'];

const COLLEGES = [
  { slug: 'grgarts', code: 'GRG-INDI-01', prefix: 'GRG24' }
];

const STREAMS = ['B.A', 'B.Com', 'B.Sc', 'B.B.A', 'B.C.A'];
const CLASSES = ['SEM 01', 'SEM 02', 'SEM 03', 'SEM 04', 'SEM 05', 'SEM 06'];
const SECTIONS = ['Sec A', 'Sec B', 'Sec C'];

// Degree College Sample Courses for GRG Arts & YAP Commerce College
const DEGREE_COURSES = [
  {
    code: '24BC4ACC01',
    title: 'CORPORATE ACCOUNTING & AUDITING',
    instructor: 'Prof. S. S. Biradar',
    instructorRole: 'Head of Commerce Dept',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    notesUrl: '#',
    classesAttended: 28,
    totalClasses: 32,
    stillToGo: 0,
    evaluations: { test1: 18, test1Max: 20, test2: 17, test2Max: 20, test3: 19, test3Max: 20, aat1: 9, aat1Max: 10, finalIa: 45, finalIaMax: 50, attendancePercent: 88 },
    presentTable: [
      { slNo: 1, date: '02-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 2, date: '04-07-2026', time: '10:00 TO 11:00', status: 'Present' },
      { slNo: 3, date: '07-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 4, date: '09-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 5, date: '14-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 6, date: '16-07-2026', time: '10:00 TO 11:00', status: 'Present' },
      { slNo: 7, date: '21-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 8, date: '23-07-2026', time: '11:15 TO 12:15', status: 'Present' }
    ],
    absentTable: [
      { slNo: 1, date: '11-07-2026', time: '09:00 TO 10:00', status: 'Absent' },
      { slNo: 2, date: '18-07-2026', time: '10:00 TO 11:00', status: 'Absent' }
    ]
  },
  {
    code: '24BA4ECO02',
    title: 'MANAGERIAL & MICRO ECONOMICS',
    instructor: 'Prof. K. R. Kulkarni',
    instructorRole: 'Associate Professor, Arts',
    instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    notesUrl: '#',
    classesAttended: 26,
    totalClasses: 30,
    stillToGo: 0,
    evaluations: { test1: 16, test1Max: 20, test2: 18, test2Max: 20, test3: 17, test3Max: 20, aat1: 8, aat1Max: 10, finalIa: 42, finalIaMax: 50, attendancePercent: 86 },
    presentTable: [
      { slNo: 1, date: '03-07-2026', time: '10:00 TO 11:00', status: 'Present' },
      { slNo: 2, date: '06-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 3, date: '10-07-2026', time: '10:00 TO 11:00', status: 'Present' },
      { slNo: 4, date: '13-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 5, date: '17-07-2026', time: '10:00 TO 11:00', status: 'Present' },
      { slNo: 6, date: '20-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 7, date: '24-07-2026', time: '10:00 TO 11:00', status: 'Present' }
    ],
    absentTable: [
      { slNo: 1, date: '08-07-2026', time: '11:15 TO 12:15', status: 'Absent' },
      { slNo: 2, date: '15-07-2026', time: '09:00 TO 10:00', status: 'Absent' }
    ]
  },
  {
    code: '24BA4ENG03',
    title: 'ADVANCED ENGLISH LITERATURE & COMMUNICATION',
    instructor: 'Dr. B. M. Patil',
    instructorRole: 'Principal & HOD English',
    instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    notesUrl: '#',
    classesAttended: 30,
    totalClasses: 32,
    stillToGo: 0,
    evaluations: { test1: 19, test1Max: 20, test2: 19, test2Max: 20, test3: 20, test3Max: 20, aat1: 10, aat1Max: 10, finalIa: 48, finalIaMax: 50, attendancePercent: 93 },
    presentTable: [
      { slNo: 1, date: '01-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 2, date: '05-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 3, date: '08-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 4, date: '12-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 5, date: '15-07-2026', time: '11:15 TO 12:15', status: 'Present' },
      { slNo: 6, date: '19-07-2026', time: '09:00 TO 10:00', status: 'Present' },
      { slNo: 7, date: '22-07-2026', time: '11:15 TO 12:15', status: 'Present' }
    ],
    absentTable: [
      { slNo: 1, date: '25-07-2026', time: '09:00 TO 10:00', status: 'Absent' }
    ]
  },
  {
    code: '24BC4KAN04',
    title: 'KANNADA SAHITYA SOURABHA & KAVYA',
    instructor: 'Prof. S. M. Hiremath',
    instructorRole: 'Assistant Professor, Kannada',
    instructorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    notesUrl: '#',
    classesAttended: 27,
    totalClasses: 30,
    stillToGo: 0,
    evaluations: { test1: 17, test1Max: 20, test2: 18, test2Max: 20, test3: 18, test3Max: 20, aat1: 9, aat1Max: 10, finalIa: 44, finalIaMax: 50, attendancePercent: 90 },
    presentTable: [
      { slNo: 1, date: '03-07-2026', time: '12:15 TO 01:15', status: 'Present' },
      { slNo: 2, date: '07-07-2026', time: '12:15 TO 01:15', status: 'Present' },
      { slNo: 3, date: '10-07-2026', time: '12:15 TO 01:15', status: 'Present' },
      { slNo: 4, date: '14-07-2026', time: '12:15 TO 01:15', status: 'Present' },
      { slNo: 5, date: '17-07-2026', time: '12:15 TO 01:15', status: 'Present' },
      { slNo: 6, date: '21-07-2026', time: '12:15 TO 01:15', status: 'Present' }
    ],
    absentTable: [
      { slNo: 1, date: '24-07-2026', time: '12:15 TO 01:15', status: 'Absent' }
    ]
  },
  {
    code: '24BC4GST05',
    title: 'BUSINESS REGULATORY FRAMEWORK & GST LAW',
    instructor: 'Prof. S. S. Biradar',
    instructorRole: 'Head of Commerce Dept',
    instructorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    notesUrl: '#',
    classesAttended: 25,
    totalClasses: 28,
    stillToGo: 0,
    evaluations: { test1: 15, test1Max: 20, test2: 16, test2Max: 20, test3: 17, test3Max: 20, aat1: 8, aat1Max: 10, finalIa: 39, finalIaMax: 50, attendancePercent: 89 },
    presentTable: [
      { slNo: 1, date: '04-07-2026', time: '02:00 TO 03:00', status: 'Present' },
      { slNo: 2, date: '11-07-2026', time: '02:00 TO 03:00', status: 'Present' },
      { slNo: 3, date: '18-07-2026', time: '02:00 TO 03:00', status: 'Present' },
      { slNo: 4, date: '25-07-2026', time: '02:00 TO 03:00', status: 'Present' }
    ],
    absentTable: [
      { slNo: 1, date: '08-07-2026', time: '02:00 TO 03:00', status: 'Absent' }
    ]
  }
];

// Generate 70 students per class and section for a college
function generateStudentsForCollege(college) {
  const students = [];

  CLASSES.forEach((cls) => {
    const classNum = cls.replace(/[^0-9]/g, '');

    SECTIONS.forEach((sec) => {
      const secLetter = sec.replace('Sec ', '');

      for (let i = 1; i <= 70; i++) {
        const fn = FIRST_NAMES[(i + classNum.charCodeAt(0) + secLetter.charCodeAt(0)) % FIRST_NAMES.length];
        const ln = LAST_NAMES[(i * 3 + classNum.charCodeAt(0)) % LAST_NAMES.length];
        const numStr = i < 10 ? `00${i}` : i < 100 ? `0${i}` : `${i}`;
        const streamType = STREAMS[i % STREAMS.length];
        const rollNo = college.slug === 'grgarts' 
          ? `GRG24${streamType.replace(/[^A-Z]/g, '')}${numStr}` 
          : `${college.prefix}CS${classNum}${secLetter}${numStr}`;

        const isGrg = college.slug === 'grgarts';

        students.push({
          id: `std-${college.slug}-${classNum}-${secLetter}-${i}`,
          institutionSlug: college.slug,
          institutionCode: college.code,
          rollNo: rollNo,
          name: i === 1 && isGrg ? 'Sudeep Suresh Biradar' : `${fn} ${ln}`,
          email: i === 1 && isGrg 
            ? 'sudeepsuresh.bs24@bmsce.ac.in' 
            : `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${college.slug === 'grgarts' ? 'grgindi.edu.in' : 'bmsce.ac.in'}`,
          department: isGrg ? streamType : 'Computer Science & Engineering',
          stream: isGrg ? streamType : 'B.E',
          section: sec,
          semester: cls,
          password: 'Student#1234',
          feePlan: 'Portal Registration & Processing Fee',
          feeAmount: 50,
          paymentStatus: 'PAID',
          utrNumber: `UPI/4209${classNum}${secLetter.charCodeAt(0)}${numStr}`,
          createdAt: '2026-02-05T09:00:00.000Z',
          courses: isGrg ? DEGREE_COURSES : [
            {
              code: '23BS4PCFLA',
              title: 'FORMAL LANGUAGE AND AUTOMATA THEORY',
              instructor: 'Prof. Rudramurthy',
              instructorRole: 'Assistant Professor, CSE',
              instructorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
              classesAttended: 8,
              totalClasses: 12,
              stillToGo: 0,
              evaluations: {
                test1: 11 + (i % 8),
                test1Max: 20,
                test2: 13 + (i % 6),
                test2Max: 20,
                test3: 15 + (i % 5),
                test3Max: 20,
                aat1: 7 + (i % 3),
                aat1Max: 10,
                finalIa: 35 + (i % 14),
                finalIaMax: 50,
                attendancePercent: 85 + (i % 12)
              },
              presentTable: [
                { slNo: 1, date: '03-03-2026', time: '14:00 TO 15:50', status: 'Present' },
                { slNo: 2, date: '05-03-2026', time: '08:55 TO 09:50', status: 'Present' },
                { slNo: 3, date: '10-03-2026', time: '14:00 TO 15:50', status: 'Present' },
                { slNo: 4, date: '12-03-2026', time: '08:55 TO 09:50', status: 'Present' },
                { slNo: 5, date: '13-03-2026', time: '11:15 TO 12:10', status: 'Present' },
                { slNo: 6, date: '17-03-2026', time: '14:00 TO 15:50', status: 'Present' },
                { slNo: 7, date: '24-03-2026', time: '14:00 TO 15:50', status: 'Present' },
                { slNo: 8, date: '26-03-2026', time: '08:55 TO 09:50', status: 'Present' }
              ],
              absentTable: [
                { slNo: 1, date: '27-02-2026', time: '11:15 TO 12:10', status: 'Absent' },
                { slNo: 2, date: '05-05-2026', time: '14:00 TO 15:50', status: 'Absent' },
                { slNo: 3, date: '12-05-2026', time: '14:00 TO 15:50', status: 'Absent' },
                { slNo: 4, date: '09-06-2026', time: '14:00 TO 15:50', status: 'Absent' }
              ]
            }
          ]
        });
      }
    });
  });

  return students;
}

// Generate initial students for predefined colleges
export const INITIAL_STUDENTS = COLLEGES.flatMap(generateStudentsForCollege);

const LOCAL_STORAGE_KEY = 'students_store_v1';

export function getStudents() {
  if (typeof window === 'undefined') return INITIAL_STUDENTS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    const parsed = JSON.parse(data);
    if (!parsed || parsed.length === 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_STUDENTS));
      return INITIAL_STUDENTS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading students store', e);
    return INITIAL_STUDENTS;
  }
}

export function saveStudents(students) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students store', e);
    }
  }
}

export function getStudentsByInstitution(slug) {
  const students = getStudents();
  const clean = (slug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return students.filter(s => {
    const sSlug = (s.institutionSlug || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const sCode = (s.institutionCode || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if ((clean.includes('grg') || clean.includes('indi') || clean.includes('yap')) && 
        (sSlug.includes('grg') || sCode.includes('grg'))) {
      return true;
    }
    return sSlug === clean || sCode === clean || sSlug.includes(clean) || clean.includes(sSlug);
  });
}

export function findStudentByEmail(slug, email) {
  const students = getStudentsByInstitution(slug);
  const cleanEmail = email?.trim()?.toLowerCase();
  return students.find(s => s.email?.trim()?.toLowerCase() === cleanEmail);
}

export function registerStudent(studentData) {
  const students = getStudents();
  const cleanEmail = studentData.email?.trim()?.toLowerCase();
  
  // Find existing student record by email
  const existingIndex = students.findIndex(
    s => s.email?.trim()?.toLowerCase() === cleanEmail && (s.institutionSlug === studentData.institutionSlug || s.institutionCode?.toLowerCase() === studentData.institutionSlug?.toLowerCase())
  );

  if (existingIndex !== -1) {
    const updated = [...students];
    updated[existingIndex] = {
      ...updated[existingIndex],
      name: studentData.name.trim() || updated[existingIndex].name,
      stream: studentData.stream || updated[existingIndex].stream || 'B.A',
      department: studentData.stream || updated[existingIndex].department,
      semester: studentData.semester || updated[existingIndex].semester,
      password: studentData.password || updated[existingIndex].password,
      paymentStatus: 'PAID',
      utrNumber: studentData.utrNumber?.trim()?.toUpperCase() || updated[existingIndex].utrNumber
    };
    saveStudents(updated);
    return updated[existingIndex];
  }

  const generatedRollNo = studentData.rollNo?.trim() || `GRG24BA${Math.floor(100 + Math.random() * 899)}`;

  const newStudent = {
    id: `std-${Date.now()}`,
    institutionSlug: studentData.institutionSlug,
    institutionCode: studentData.institutionCode || studentData.institutionSlug.toUpperCase(),
    rollNo: generatedRollNo.toUpperCase(),
    name: studentData.name.trim(),
    stream: studentData.stream || 'B.A',
    department: studentData.stream || 'Bachelor of Arts (B.A)',
    section: 'Sec A',
    semester: studentData.semester || 'SEM 04',
    password: studentData.password,
    feePlan: studentData.feePlan || 'Web Portal Processing Fee',
    feeAmount: studentData.feeAmount || 50,
    paymentStatus: 'PAID',
    utrNumber: studentData.utrNumber?.trim()?.toUpperCase() || 'UPI/PENDING',
    createdAt: new Date().toISOString(),
    courses: DEGREE_COURSES
  };

  const updated = [newStudent, ...students];
  saveStudents(updated);
  return newStudent;
}

export function verifyStudentPayment(id) {
  const students = getStudents();
  const updated = students.map(s => s.id === id ? { ...s, paymentStatus: 'PAID' } : s);
  saveStudents(updated);
  return updated;
}

export function rejectStudentPayment(id) {
  const students = getStudents();
  const updated = students.map(s => s.id === id ? { ...s, paymentStatus: 'REJECTED' } : s);
  saveStudents(updated);
  return updated;
}

export function verifyStudentLogin(slug, semOrSec, rollNo, password, stream) {
  const students = getStudentsByInstitution(slug);
  
  const cleanSemSec = semOrSec?.trim()?.toLowerCase() || '';
  const cleanRollNo = rollNo?.trim()?.toLowerCase() || '';
  const cleanStream = stream?.trim()?.toLowerCase() || '';

  const found = students.find(s => {
    const sSem = s.semester?.trim()?.toLowerCase() || '';
    const sSec = s.section?.trim()?.toLowerCase() || '';
    const sRollNo = s.rollNo?.trim()?.toLowerCase() || '';
    const sEmail = s.email?.trim()?.toLowerCase() || '';
    const sDept = (s.department || s.stream || '')?.trim()?.toLowerCase() || '';

    const semMatches = !cleanSemSec || sSem.includes(cleanSemSec) || cleanSemSec.includes(sSem) || sSec.includes(cleanSemSec) || cleanSemSec.includes(sSec);
    const streamMatches = !cleanStream || sDept.includes(cleanStream) || cleanStream.includes(sDept);
    const rollMatches = sRollNo === cleanRollNo || sEmail === cleanRollNo;

    return semMatches && streamMatches && rollMatches && s.password === password;
  }) || students.find(s => (s.rollNo?.trim()?.toLowerCase() === cleanRollNo || s.email?.trim()?.toLowerCase() === cleanRollNo) && s.password === password);

  if (!found) return { success: false, error: 'Invalid Stream, Semester, Roll Number, or Password.' };
  if (found.paymentStatus === 'REJECTED') {
    return { success: false, error: 'Your fee payment verification was rejected. Please contact institution admin.' };
  }

  return { success: true, student: found };
}
