// Data store for Institutions (Tier 1 & Tier 2)

export const INITIAL_INSTITUTIONS = [
  {
    id: 'inst-1',
    name: 'B.M.S. College of Engineering',
    code: 'BMSCE-01',
    slug: 'bmsce',
    location: 'Bengaluru, Karnataka',
    officialEmail: 'admin@bmsce.ac.in',
    status: 'ACTIVE',
    adminName: 'Dr. S. R. Ranganatha',
    registeredDate: '2026-01-15',
    qrPaymentConfigured: true,
    upiId: 'bmsce.fee@upi',
    portalUrl: '/institution/bmsce/login',
    totalStudents: 1050,
    totalTeachers: 48,
    revenueCollected: 52500,
    generatedPassword: 'InstAdmin#8841'
  },
  {
    id: 'inst-2',
    name: 'R.V. College of Engineering',
    code: 'RVCE-02',
    slug: 'rvce',
    location: 'Bengaluru, Karnataka',
    officialEmail: 'admin@rvce.edu.in',
    status: 'ACTIVE',
    adminName: 'Dr. K. N. Subramanya',
    registeredDate: '2026-01-20',
    qrPaymentConfigured: true,
    upiId: 'rvce.fee@upi',
    portalUrl: '/institution/rvce/login',
    totalStudents: 1050,
    totalTeachers: 52,
    revenueCollected: 52500,
    generatedPassword: 'InstAdmin#9120'
  },
  {
    id: 'inst-3',
    name: 'M.S. Ramaiah Institute of Technology',
    code: 'MSRIT-03',
    slug: 'msrit',
    location: 'Bengaluru, Karnataka',
    officialEmail: 'principal@msrit.edu',
    status: 'ACTIVE',
    adminName: 'Dr. N. V. R. Naidu',
    registeredDate: '2026-02-01',
    qrPaymentConfigured: true,
    upiId: 'msrit.fee@upi',
    portalUrl: '/institution/msrit/login',
    totalStudents: 1050,
    totalTeachers: 42,
    revenueCollected: 52500,
    generatedPassword: 'InstAdmin#3341'
  },
  {
    id: 'inst-4',
    name: 'PES University',
    code: 'PESU-04',
    slug: 'pesu',
    location: 'Bengaluru, Karnataka',
    officialEmail: 'admin@pes.edu',
    status: 'ACTIVE',
    adminName: 'Dr. J. Suryaprasad',
    registeredDate: '2026-02-10',
    qrPaymentConfigured: true,
    upiId: 'pesu.fee@upi',
    portalUrl: '/institution/pesu/login',
    totalStudents: 1050,
    totalTeachers: 60,
    revenueCollected: 52500,
    generatedPassword: 'InstAdmin#7712'
  },
  {
    id: 'inst-5',
    name: 'Dayananda Sagar College of Engineering',
    code: 'DSCE-05',
    slug: 'dsce',
    location: 'Bengaluru, Karnataka',
    officialEmail: 'principal@dayanandasagar.edu',
    status: 'ACTIVE',
    adminName: 'Dr. B. G. Prasad',
    registeredDate: '2026-02-14',
    qrPaymentConfigured: true,
    upiId: 'dsce.fee@upi',
    portalUrl: '/institution/dsce/login',
    totalStudents: 1050,
    totalTeachers: 45,
    revenueCollected: 52500,
    generatedPassword: 'InstAdmin#5521'
  }
];

const LOCAL_STORAGE_KEY = 'institutions_store_v1';

export function getInstitutions() {
  if (typeof window === 'undefined') return INITIAL_INSTITUTIONS;
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_INSTITUTIONS));
      return INITIAL_INSTITUTIONS;
    }
    const parsed = JSON.parse(data);
    if (!parsed || parsed.length < 5) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_INSTITUTIONS));
      return INITIAL_INSTITUTIONS;
    }
    // Ensure all items have portalUrl
    const sanitized = parsed.map(inst => ({
      ...inst,
      portalUrl: inst.portalUrl || `/institution/${inst.slug || generateSlug(inst.code)}/login`
    }));
    return sanitized;
  } catch (e) {
    console.error('Error reading institutions store', e);
    return INITIAL_INSTITUTIONS;
  }
}

export function saveInstitutions(institutions) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(institutions));
    } catch (e) {
      console.error('Error saving institutions store', e);
    }
  }
}

export function generateSlug(codeOrName) {
  return (codeOrName || 'college').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function generateAccessPassword() {
  return `InstAdmin#${Math.floor(1000 + Math.random() * 9000)}`;
}

export function addInstitution(instData) {
  const current = getInstitutions();
  const slug = generateSlug(instData.code || instData.name);
  const newInst = {
    id: `inst-${Date.now()}`,
    name: instData.name,
    code: instData.code,
    slug: slug,
    location: instData.location || 'Karnataka, India',
    officialEmail: instData.officialEmail,
    status: 'ACTIVE',
    adminName: instData.adminName || 'College Admin',
    registeredDate: new Date().toISOString().split('T')[0],
    qrPaymentConfigured: true,
    upiId: `${slug}.fee@upi`,
    portalUrl: `/institution/${slug}/login`,
    totalStudents: 1050,
    totalTeachers: 25,
    revenueCollected: 52500,
    generatedPassword: instData.generatedPassword || generateAccessPassword()
  };

  const updated = [newInst, ...current];
  saveInstitutions(updated);
  return newInst;
}

export function updateInstitution(id, updatedFields) {
  const current = getInstitutions();
  const updated = current.map(inst => inst.id === id ? { ...inst, ...updatedFields } : inst);
  saveInstitutions(updated);
  return updated;
}

export function toggleInstitutionStatus(id) {
  const current = getInstitutions();
  const updated = current.map(inst => {
    if (inst.id === id) {
      return { ...inst, status: inst.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
    }
    return inst;
  });
  saveInstitutions(updated);
  return updated;
}

export function deleteInstitution(id) {
  const current = getInstitutions();
  const updated = current.filter(inst => inst.id !== id);
  saveInstitutions(updated);
  return updated;
}
