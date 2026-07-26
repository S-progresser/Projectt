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
    if (!parsed || parsed.length === 0) {
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
