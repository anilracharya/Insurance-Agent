import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Lead, LeadRequest, LeadStatus, ApiResponse } from '../types';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const STATUSES: LeadStatus[] = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATION', 'WON', 'LOST'];

const emptyForm: LeadRequest = { firstName: '', lastName: '', email: '', phone: '', source: '', assignedAgent: '', notes: '' };

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadRequest>(emptyForm);
  const [filter, setFilter] = useState<LeadStatus | ''>('');
  const [saving, setSaving] = useState(false);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const url = filter ? `/leads/status/${filter}` : '/leads';
      const res = await client.get<ApiResponse<Lead[]>>(url);
      setLeads(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (lead: Lead) => {
    setEditing(lead);
    setForm({
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone || '',
      source: lead.source || '',
      assignedAgent: lead.assignedAgent || '',
      notes: lead.notes || '',
      status: lead.status,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/leads/${editing.id}`, form);
      } else {
        await client.post('/leads', form);
      }
      setModalOpen(false);
      fetchLeads();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await client.delete(`/leads/${id}`);
    fetchLeads();
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <button onClick={openCreate} className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          <Plus size={16} /> Add Lead
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-3 py-1 rounded-full text-sm ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm ${filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-x-auto">
        {loading ? (
          <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>
        ) : leads.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">No leads found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Link to={`/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">
                      {lead.firstName} {lead.lastName}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-600">{lead.phone || '-'}</td>
                  <td className="px-4 py-3"><Badge status={lead.status} /></td>
                  <td className="px-4 py-3 text-gray-600">{lead.source || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(lead)} className="text-gray-400 hover:text-blue-600 mr-2">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(lead.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Lead' : 'New Lead'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input value={form.phone} onChange={(e) => update('phone', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
            <input value={form.source} onChange={(e) => update('source', e.target.value)} placeholder="e.g. Website, Referral" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Agent</label>
            <input value={form.assignedAgent} onChange={(e) => update('assignedAgent', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => update('status', e.target.value)} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
