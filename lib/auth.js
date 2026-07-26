// Role-based auth utilities for Superadmin

export const SUPERADMIN_CREDENTIALS = {
  email: 'superadmin@eduportal.com',
  password: 'admin123',
  name: 'Global System Architect',
  role: 'SUPER_ADMIN',
  superadminId: 'SA-MASTER-001'
};

export function verifySuperAdminCredentials(email, password) {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === SUPERADMIN_CREDENTIALS.email.toLowerCase() &&
    password === SUPERADMIN_CREDENTIALS.password
  );
}

export function createSuperAdminSession() {
  const sessionData = {
    user: {
      email: SUPERADMIN_CREDENTIALS.email,
      name: SUPERADMIN_CREDENTIALS.name,
      role: SUPERADMIN_CREDENTIALS.role,
      id: SUPERADMIN_CREDENTIALS.superadminId,
    },
    loginTimestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  return sessionData;
}
