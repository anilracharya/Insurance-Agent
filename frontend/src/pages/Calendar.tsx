import { useEffect, useState } from 'react';
import client from '../api/client';
import type { CalendarSlot, CalendarSlotRequest, ApiResponse } from '../types';
import { Plus, Trash2, CalendarDays, Clock } from 'lucide-react';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';

const emptyForm: CalendarSlotRequest = { agentId: '', startTime: '', endTime: '', title: '', notes: '' };

export default function Calendar() {
  const { user } = useAuth();
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<CalendarSlotRequest>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const url = showAvailable ? '/calendar/slots/available' : '/calendar/slots';
      const res = await client.get<ApiResponse<CalendarSlot[]>>(url);
      setSlots(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSlots(); }, [showAvailable]);

  const openCreate = () => {
    setForm({ ...emptyForm, agentId: user?.userId || '' });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await client.post('/calendar/slots', form);
      setModalOpen(false);
      fetchSlots();
    } finally {
      setSaving(false);
    }
  };

  const toggleBooked = async (slot: CalendarSlot) => {
    await client.put(`/calendar/slots/${slot.id}`, { ...slot, booked: !slot.booked });
    fetchSlots();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this slot?')) return;
    await client.delete(`/calendar/slots/${id}`);
    fetchSlots();
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const fmtDate = (d: string) => new Date(d).toLocaleDateString();
  const fmtTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <button onClick={openCreate} className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          <Plus size={16} /> New Slot
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowAvailable(false)}
          className={`px-3 py-1 rounded-full text-sm ${!showAvailable ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Slots
        </button>
        <button
          onClick={() => setShowAvailable(true)}
          className={`px-3 py-1 rounded-full text-sm ${showAvailable ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Available Only
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>
      ) : slots.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <CalendarDays size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No calendar slots found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((slot) => (
            <div key={slot.id} className="bg-white rounded-lg border p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${slot.booked ? 'bg-red-50' : 'bg-green-50'}`}>
                  <Clock size={20} className={slot.booked ? 'text-red-600' : 'text-green-600'} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{slot.title || 'Untitled Slot'}</h3>
                  <p className="text-sm text-gray-500">
                    {fmtDate(slot.startTime)} &middot; {fmtTime(slot.startTime)} - {fmtTime(slot.endTime)}
                  </p>
                  {slot.notes && <p className="text-xs text-gray-400 mt-1">{slot.notes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBooked(slot)}
                  className={`text-xs px-3 py-1 rounded-full ${slot.booked ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                >
                  {slot.booked ? 'Booked' : 'Available'}
                </button>
                <button onClick={() => handleDelete(slot.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Calendar Slot">
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Meeting, Consultation..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Agent ID *</label>
            <input value={form.agentId} onChange={(e) => update('agentId', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <input type="datetime-local" value={form.startTime} onChange={(e) => update('startTime', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <input type="datetime-local" value={form.endTime} onChange={(e) => update('endTime', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
