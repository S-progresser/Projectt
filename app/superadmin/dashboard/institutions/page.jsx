'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Copy, 
  ExternalLink, 
  Edit3, 
  Power, 
  Trash2, 
  Key, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Mail, 
  User, 
  Phone, 
  Eye,
  EyeOff,
  ChevronRight
} from 'lucide-react';
import { 
  getInstitutions, 
  addInstitution, 
  updateInstitution, 
  toggleInstitutionStatus, 
  deleteInstitution,
  generateAccessPassword,
  generateSlug
} from '@/lib/institutionsStore';

export default function InstitutionManagementPage() {
  const [institutions, setInstitutions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modals & Drawers
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState(null);
  const [viewingCredentialsInst, setViewingCredentialsInst] = useState(null);
  
  // Feedback Toasts
  const [toastMessage, setToastMessage] = useState(null);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [showPasswordMap, setShowPasswordMap] = useState({});

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    officialEmail: '',
    contactPerson: '',
    phone: '',
    address: '',
    generatedPassword: '',
    status: 'ACTIVE'
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    try {
      const data = getInstitutions();
      setInstitutions(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openRegisterModal = () => {
    setEditingInst(null);
    setFormData({
      name: '',
      code: '',
      officialEmail: '',
      contactPerson: '',
      phone: '',
      address: '',
      generatedPassword: generateAccessPassword(),
      status: 'ACTIVE'
    });
    setFormErrors({});
    setIsRegisterModalOpen(true);
  };

  const openEditModal = (inst) => {
    setEditingInst(inst);
    setFormData({
      name: inst.name,
      code: inst.code,
      officialEmail: inst.officialEmail,
      contactPerson: inst.adminName || inst.contactPerson || '',
      phone: inst.phone || '',
      address: inst.location || inst.address || '',
      generatedPassword: inst.generatedPassword || generateAccessPassword(),
      status: inst.status || 'ACTIVE'
    });
    setFormErrors({});
    setIsRegisterModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Institution Name is required';
    if (!formData.code.trim()) errors.code = 'Institution Code/ID is required';
    if (!formData.officialEmail.trim()) {
      errors.officialEmail = 'Official Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.officialEmail)) {
      errors.officialEmail = 'Invalid email address';
    }
    if (!formData.contactPerson.trim()) errors.contactPerson = 'Admin Contact Person is required';
    if (!formData.generatedPassword.trim()) errors.generatedPassword = 'Generated password cannot be empty';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingInst) {
      updateInstitution(editingInst.id, formData);
      showToast(`Successfully updated "${formData.name}"`);
    } else {
      const created = addInstitution(formData);
      showToast(`Institution "${created.name}" registered successfully with workspace link!`);
    }

    refreshData();
    setIsRegisterModalOpen(false);
  };

  const handleToggleStatus = (inst) => {
    toggleInstitutionStatus(inst.id);
    refreshData();
    const newStatus = inst.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    showToast(`Status for "${inst.name}" updated to ${newStatus}`);
  };

  const handleDelete = (inst) => {
    if (confirm(`Are you sure you want to delete "${inst.name}"? This action cannot be undone.`)) {
      deleteInstitution(inst.id);
      refreshData();
      showToast(`Deleted institution "${inst.name}"`, 'warning');
    }
  };

  const copyPortalLink = (inst) => {
    const pUrl = inst?.portalUrl || `/institution/${inst?.slug || 'bmsce'}/login`;
    const fullUrl = `${window.location.origin}${pUrl}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(inst.slug);
    setTimeout(() => setCopiedSlug(null), 2500);
    showToast(`Copied Portal Link: ${fullUrl}`);
  };

  const togglePasswordVisibility = (id) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtered List
  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch = 
      (inst.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.code || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.officialEmail || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.adminName || inst.contactPerson || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || inst.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-5 right-5 z-50 p-4 rounded-xl shadow-lg flex items-center space-x-3 text-xs font-semibold border transition-all animate-bounce ${
          toastMessage.type === 'warning' 
            ? 'bg-amber-50 text-amber-800 border-amber-300' 
            : 'bg-emerald-50 text-emerald-800 border-emerald-300'
        }`}>
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-indigo-700 font-mono font-bold mb-1">
            <span>SUPERADMIN CONSOLE</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span>INSTITUTION MANAGEMENT</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Building2 className="w-8 h-8 text-indigo-600" />
            Institution Management Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-600 mt-1">
            Register new educational institutions (e.g. B.M.S. College of Engineering), issue access credentials, and monitor generated workspace links.
          </p>
        </div>

        <button
          onClick={openRegisterModal}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Institution</span>
        </button>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Institution Name, Code (e.g. BMSCE), or Email..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto">
          <span className="text-xs text-slate-500 flex items-center space-x-1 mr-2">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {['ALL', 'ACTIVE', 'INACTIVE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === status
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {status === 'ALL' ? 'All Institutions' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Institutions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[10px]">
                <th className="py-4 px-5">Institution Details</th>
                <th className="py-4 px-5">Official Email & Phone</th>
                <th className="py-4 px-5">Admin Contact</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Access Credentials</th>
                <th className="py-4 px-5">Auto-Generated Workspace Link</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInstitutions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Building2 className="w-10 h-10 mx-auto text-slate-400 mb-3" />
                    <p className="font-semibold text-sm text-slate-800">No Institutions Found</p>
                    <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredInstitutions.map((inst) => {
                  const targetPortalUrl = inst.portalUrl || `/institution/${inst.slug || 'bmsce'}/login`;
                  return (
                    <tr key={inst.id} className="hover:bg-slate-50 transition-colors">
                      {/* Details */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-slate-900 text-sm">{inst.name}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-mono text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded font-bold">
                            {inst.code}
                          </span>
                          <span className="text-[10px] text-slate-500">Tier 2 Workspace</span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-1.5 font-mono text-slate-800">
                          <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span>{inst.officialEmail}</span>
                        </div>
                        {inst.phone && (
                          <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] mt-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{inst.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Contact Person */}
                      <td className="py-4 px-5">
                        <div className="font-medium text-slate-900 flex items-center space-x-1.5">
                          <User className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{inst.adminName || inst.contactPerson || 'College Admin'}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => handleToggleStatus(inst)}
                          title="Click to toggle status"
                          className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide transition-all ${
                            inst.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${inst.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                          <span>{inst.status}</span>
                        </button>
                      </td>

                      {/* Generated Credentials */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <div className="font-mono text-xs bg-slate-100 px-2.5 py-1 rounded border border-slate-200 text-slate-800 flex items-center space-x-2">
                            <span>
                              {showPasswordMap[inst.id] ? (inst.generatedPassword || 'InstAdmin#1234') : '••••••••••••'}
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(inst.id)}
                              className="text-slate-400 hover:text-slate-800"
                            >
                              {showPasswordMap[inst.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            </button>
                          </div>
                          <button
                            onClick={() => setViewingCredentialsInst(inst)}
                            title="View Access Pass"
                            className="p-1.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Key className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Auto-Generated Workspace Link */}
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={targetPortalUrl}
                            target="_blank"
                            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-800 rounded-lg transition-all flex items-center space-x-1.5 border border-indigo-200 text-[11px] font-mono group"
                          >
                            <span className="text-indigo-800 group-hover:text-white font-bold">{targetPortalUrl}</span>
                            <ExternalLink className="w-3 h-3 text-indigo-600 group-hover:text-white" />
                          </Link>

                          <button
                            onClick={() => copyPortalLink(inst)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Copy Workspace Portal URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          {copiedSlug === inst.slug && (
                            <span className="text-[10px] text-emerald-700 font-mono font-bold">Copied!</span>
                          )}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => openEditModal(inst)}
                            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Institution"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(inst)}
                            className={`p-2 rounded-lg transition-colors ${
                              inst.status === 'ACTIVE'
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={inst.status === 'ACTIVE' ? 'Deactivate Institution' : 'Activate Institution'}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(inst)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Institution"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Register / Edit Institution */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-6 md:p-8 border border-slate-200 shadow-xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {editingInst ? `Edit Institution: ${editingInst.name}` : 'Register New Institution'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {editingInst ? 'Update institution metadata and configuration.' : 'Provision a new Tier-2 institution workspace.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Institution Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      setFormData(prev => ({
                        ...prev,
                        name: newName,
                        code: prev.code || newName.split(' ').map(w => w[0]).join('').toUpperCase()
                      }));
                    }}
                    placeholder="e.g. B.M.S. College of Engineering"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.name && <p className="text-[11px] text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                {/* Institution Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Institution Code / Unique ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. BMSCE-01"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 uppercase font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.code && <p className="text-[11px] text-red-500 mt-1">{formErrors.code}</p>}
                </div>

                {/* Official Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.officialEmail}
                    onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                    placeholder="admin@bmsce.ac.in"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.officialEmail && <p className="text-[11px] text-red-500 mt-1">{formErrors.officialEmail}</p>}
                </div>

                {/* Admin Contact Person */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    placeholder="Dr. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {formErrors.contactPerson && <p className="text-[11px] text-red-500 mt-1">{formErrors.contactPerson}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Initial Portal Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACTIVE">ACTIVE (Operational)</option>
                    <option value="INACTIVE">INACTIVE (Restricted)</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Campus Address / Location
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Bull Temple Rd, Basavanagudi, Bengaluru"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Generated Access Credentials */}
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-indigo-900 flex items-center space-x-1.5">
                    <Key className="w-4 h-4 text-indigo-600" />
                    <span>Generated Access Credential Password</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, generatedPassword: generateAccessPassword() })}
                    className="text-[11px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Password</span>
                  </button>
                </div>

                <input
                  type="text"
                  value={formData.generatedPassword}
                  onChange={(e) => setFormData({ ...formData, generatedPassword: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 bg-white font-mono text-emerald-700 font-bold"
                />
                <p className="text-[10px] text-slate-500">
                  This master initial password will be provided to the Institution Admin to access their portal workspace link.
                </p>
              </div>

              {/* Generated URL Link Preview */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                <span className="text-slate-500 font-mono text-[10px]">AUTO-GENERATED WORKSPACE PORTAL LINK PREVIEW:</span>
                <p className="font-mono text-indigo-700 font-bold text-xs mt-1">
                  /institution/{generateSlug(formData.name || 'college-name')}/login
                </p>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm"
                >
                  {editingInst ? 'Save Changes' : 'Register Institution & Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: View Access Pass Credentials */}
      {viewingCredentialsInst && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 border border-slate-200 shadow-xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2 text-indigo-600">
                <Key className="w-5 h-5" />
                <h3 className="font-bold text-slate-900 text-sm">Access Credentials & Link</h3>
              </div>
              <button
                onClick={() => setViewingCredentialsInst(null)}
                className="text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-500">Institution:</span>
                <p className="font-bold text-slate-900">{viewingCredentialsInst.name}</p>
              </div>

              <div>
                <span className="text-slate-500">Official Admin Email:</span>
                <p className="font-mono text-slate-800 font-medium">{viewingCredentialsInst.officialEmail}</p>
              </div>

              <div>
                <span className="text-slate-500">Initial Generated Password:</span>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 font-mono text-emerald-800 text-sm font-bold mt-1 flex items-center justify-between">
                  <span>{viewingCredentialsInst.generatedPassword || 'InstAdmin#1234'}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(viewingCredentialsInst.generatedPassword || 'InstAdmin#1234');
                      showToast('Copied Password!');
                    }}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <span className="text-slate-500">Dedicated Portal Link:</span>
                <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 font-mono text-indigo-800 text-xs mt-1 flex items-center justify-between overflow-x-auto font-bold">
                  <span>{typeof window !== 'undefined' ? window.location.origin : ''}{viewingCredentialsInst.portalUrl || `/institution/${viewingCredentialsInst.slug}/login`}</span>
                  <button
                    onClick={() => copyPortalLink(viewingCredentialsInst)}
                    className="text-xs text-slate-500 hover:text-slate-800 ml-2"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingCredentialsInst(null)}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-xs transition-colors mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
