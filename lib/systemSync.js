// Centralized System Relational Connector & Cross-Tier Real-Time Synchronizer

import { getInstitutions } from './institutionsStore';
import { getTeachers, saveTeachers } from './teachersStore';
import { getStudents, saveStudents } from './studentsStore';

export function getGlobalSystemMetrics() {
  const institutions = getInstitutions();
  const teachers = getTeachers();
  const students = getStudents();

  const totalInstitutions = institutions.length;
  const activeInstitutions = institutions.filter(i => i.status === 'ACTIVE').length;

  const totalTeachers = teachers.length;
  const approvedTeachers = teachers.filter(t => t.status === 'APPROVED').length;

  const totalStudents = students.length;
  const activePaidStudents = students.filter(s => s.paymentStatus === 'PAID').length;

  const totalRevenue = students
    .filter(s => s.paymentStatus === 'PAID')
    .reduce((sum, s) => sum + (s.feeAmount || 0), 0);

  return {
    totalInstitutions,
    activeInstitutions,
    totalTeachers,
    approvedTeachers,
    totalStudents,
    activePaidStudents,
    totalRevenue,
    institutionBreakdown: institutions.map(inst => {
      const instTeachers = teachers.filter(t => t.institutionSlug === inst.slug || t.institutionCode?.toLowerCase() === inst.code.toLowerCase());
      const instStudents = students.filter(s => s.institutionSlug === inst.slug || s.institutionCode?.toLowerCase() === inst.code.toLowerCase());
      const instRevenue = instStudents
        .filter(s => s.paymentStatus === 'PAID')
        .reduce((sum, s) => sum + (s.feeAmount || 0), 0);

      const portalUrl = inst.portalUrl || `/institution/${inst.slug || 'bmsce'}/login`;

      return {
        ...inst,
        portalUrl,
        teacherCount: instTeachers.length,
        approvedTeacherCount: instTeachers.filter(t => t.status === 'APPROVED').length,
        studentCount: instStudents.length,
        paidStudentCount: instStudents.filter(s => s.paymentStatus === 'PAID').length,
        totalRevenue: instRevenue
      };
    })
  };
}

export function updateStudentGradeByTeacher(studentId, courseCode, evaluationData) {
  const students = getStudents();
  const updated = students.map(std => {
    if (std.id === studentId || std.rollNo === studentId) {
      const updatedCourses = std.courses.map(c => {
        if (c.code === courseCode) {
          return {
            ...c,
            evaluations: {
              ...c.evaluations,
              ...evaluationData
            }
          };
        }
        return c;
      });
      return { ...std, courses: updatedCourses };
    }
    return std;
  });

  saveStudents(updated);
  return updated;
}

export function updateStudentAttendanceByTeacher(studentId, courseCode, attendanceStatus) {
  const students = getStudents();
  const updated = students.map(std => {
    if (std.id === studentId || std.rollNo === studentId) {
      const updatedCourses = std.courses.map(c => {
        if (c.code === courseCode) {
          const newAttended = attendanceStatus === 'PRESENT' ? c.classesAttended + 1 : c.classesAttended;
          return {
            ...c,
            classesAttended: newAttended,
            totalClasses: c.totalClasses + 1
          };
        }
        return c;
      });
      return { ...std, courses: updatedCourses };
    }
    return std;
  });

  saveStudents(updated);
  return updated;
}

export function getInstitutionFullHierarchy(slug) {
  const institutions = getInstitutions();
  const inst = institutions.find(i => i.slug === slug || i.code.toLowerCase() === slug.toLowerCase());
  
  const teachers = getTeachers().filter(t => t.institutionSlug === slug || t.institutionCode?.toLowerCase() === slug?.toLowerCase());
  const students = getStudents().filter(s => s.institutionSlug === slug || s.institutionCode?.toLowerCase() === slug?.toLowerCase());

  return {
    institution: inst,
    teachers,
    students,
    totalRevenue: students.filter(s => s.paymentStatus === 'PAID').reduce((sum, s) => sum + (s.feeAmount || 0), 0)
  };
}
