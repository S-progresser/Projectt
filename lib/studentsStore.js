// Student & Fee Payment Data Store per Institution

const FIRST_NAMES = ['Aarav', 'Ananya', 'Bhuvan', 'Diya', 'Eshwar', 'Farhan', 'Gautam', 'Harini', 'Ishaan', 'Janani', 'Kavya', 'Lohith', 'Meera', 'Nikhil', 'Ojas', 'Pranav', 'Qasim', 'Rohan', 'Sneha', 'Tanvi', 'Utkarsh', 'Varun', 'Yash', 'Zoya', 'Aditya', 'Bhavana', 'Chaitanya', 'Deepika', 'Esha', 'Girish'];
const LAST_NAMES = ['Sharma', 'Kulkarni', 'Deshmukh', 'Gowda', 'Reddy', 'Patel', 'Nair', 'Iyer', 'Joshi', 'Rao', 'Verma', 'Singh', 'Bhat', 'Hegde', 'Mehta', 'Gupta', 'Shetty', 'Pillai', 'Menon', 'Chatterjee'];

const COLLEGES = [
  { slug: 'bmsce', code: 'BMSCE-01', prefix: '1BM23' },
  { slug: 'rvce', code: 'RVCE-02', prefix: '1RV23' },
  { slug: 'msrit', code: 'MSRIT-03', prefix: '1MS23' },
  { slug: 'pesu', code: 'PESU-04', prefix: '1PE23' },
  { slug: 'dsce', code: 'DSCE-05', prefix: '1DS23' }
];

const CLASSES = ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];
const SECTIONS = ['Section A', 'Section B', 'Section C'];

// Generate 70 students per class and section for a college
function generateStudentsForCollege(college) {
  const students = [];

  CLASSES.forEach((cls) => {
    const classNum = cls.replace('Class ', '');

    SECTIONS.forEach((sec) => {
      const secLetter = sec.replace('Section ', '');

      for (let i = 1; i <= 70; i++) {
        const fn = FIRST_NAMES[(i + classNum.charCodeAt(0) + secLetter.charCodeAt(0)) % FIRST_NAMES.length];
        const ln = LAST_NAMES[(i * 3 + classNum.charCodeAt(0)) % LAST_NAMES.length];
        const numStr = i < 10 ? `00${i}` : i < 100 ? `0${i}` : `${i}`;
        const rollNo = `${college.prefix}CS${classNum}${secLetter}${numStr}`;

        students.push({
          id: `std-${college.slug}-${classNum}-${secLetter}-${i}`,
          institutionSlug: college.slug,
          institutionCode: college.code,
          rollNo: rollNo,
          name: `${fn} ${ln}`,
          email: `${fn.toLowerCase()}.${ln.toLowerCase()}${i}@${college.slug}.edu.in`,
          department: 'Computer Science & Engineering',
          section: sec,
          semester: cls,
          password: 'Student#1234',
          feePlan: 'Portal Registration & Processing Fee',
          feeAmount: 50,
          paymentStatus: 'PAID',
          utrNumber: `UPI/4209${classNum}${secLetter.charCodeAt(0)}${numStr}`,
          createdAt: '2026-02-05T09:00:00.000Z',
          courses: [
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

// Generate all 5,250 initial students across 5 colleges (70 per Class & Section)
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
    if (!parsed || parsed.length < 100) {
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
  return students.filter(s => s.institutionSlug === slug || s.institutionCode?.toLowerCase() === slug.toLowerCase());
}

export function registerStudent(studentData) {
  const students = getStudents();
  
  const generatedRollNo = studentData.rollNo?.trim() || `1BM23CS${Math.floor(100 + Math.random() * 899)}`;

  const newStudent = {
    id: `std-${Date.now()}`,
    institutionSlug: studentData.institutionSlug,
    institutionCode: studentData.institutionCode || studentData.institutionSlug.toUpperCase(),
    rollNo: generatedRollNo.toUpperCase(),
    name: studentData.name.trim(),
    email: studentData.email.trim().toLowerCase(),
    department: studentData.department || 'Computer Science & Engineering',
    section: studentData.section || 'Section A',
    semester: studentData.semester || 'Class 6',
    password: studentData.password,
    feePlan: studentData.feePlan || 'Web Portal Processing Fee',
    feeAmount: studentData.feeAmount || 50,
    paymentStatus: studentData.autoApprove ? 'PAID' : 'PENDING_VERIFICATION',
    utrNumber: studentData.utrNumber?.trim()?.toUpperCase() || 'UPI/PENDING',
    createdAt: new Date().toISOString(),
    courses: [
      {
        code: '23BS4PCFLA',
        title: 'FORMAL LANGUAGE AND AUTOMATA THEORY',
        instructor: 'Prof. Rudramurthy',
        classesAttended: 8,
        totalClasses: 12,
        stillToGo: 0,
        evaluations: {
          test1: 11.0,
          test1Max: 20,
          test2: 13.0,
          test2Max: 20,
          test3: 19.0,
          test3Max: 20,
          aat1: 7.0,
          aat1Max: 10,
          finalIa: 39.0,
          finalIaMax: 50,
          attendancePercent: 89
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

export function verifyStudentLogin(slug, section, rollNo, password) {
  const students = getStudentsByInstitution(slug);
  
  const cleanSection = section?.trim()?.toLowerCase() || '';
  const cleanRollNo = rollNo?.trim()?.toLowerCase() || '';

  const found = students.find(s => {
    const sSection = s.section?.trim()?.toLowerCase() || '';
    const sRollNo = s.rollNo?.trim()?.toLowerCase() || '';
    const sEmail = s.email?.trim()?.toLowerCase() || '';

    const sectionMatches = !cleanSection || sSection.includes(cleanSection) || cleanSection.includes(sSection);
    const rollMatches = sRollNo === cleanRollNo || sEmail === cleanRollNo;
    return sectionMatches && rollMatches && s.password === password;
  }) || students.find(s => (s.rollNo?.trim()?.toLowerCase() === cleanRollNo || s.email?.trim()?.toLowerCase() === cleanRollNo) && s.password === password);

  if (!found) return { success: false, error: 'Invalid Section, Roll Number, or Password.' };
  if (found.paymentStatus === 'REJECTED') {
    return { success: false, error: 'Your fee payment verification was rejected. Please contact institution admin.' };
  }

  return { success: true, student: found };
}
