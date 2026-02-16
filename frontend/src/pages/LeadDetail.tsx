import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import type { Lead, LeadNote, ApiResponse } from '../types';
import { ArrowLeft, Send } from 'lucide-react';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leadRes, notesRes] = await Promise.all([
        client.get<ApiResponse<Lead>>(`/leads/${id}`),
        client.get<ApiResponse<LeadNote[]>>(`/leads/${id}/notes`),
      ]);
      setLead(leadRes.data.data!);
      setNotes(notesRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    setSending(true);
    try {
      await client.post(`/leads/${id}/notes`, { content: noteContent, author: user?.username });
      setNoteContent('');
      const res = await client.get<ApiResponse<LeadNote[]>>(`/leads/${id}/notes`);
      setNotes(res.data.data || []);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  if (!lead) {
    return <p className="text-gray-500">Lead not found.</p>;
  }

  const fmt = (d: string) => new Date(d).toLocaleString();

  return (
    <div className="space-y-6">
      <Link to="/leads" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} /> Back to Leads
      </Link>

      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{lead.firstName} {lead.lastName}</h1>
            <p className="text-gray-500 mt-1">{lead.email}</p>
          </div>
          <Badge status={lead.status} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          <Info label="Phone" value={lead.phone} />
          <Info label="Source" value={lead.source} />
          <Info label="Assigned Agent" value={lead.assignedAgent} />
          <Info label="Created" value={fmt(lead.createdAt)} />
          <Info label="Updated" value={fmt(lead.updatedAt)} />
        </div>

        {lead.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700">General Notes</h3>
            <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{lead.notes}</p>
          </div>
        )}
      </div>

      {/* Notes section */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Activity Notes</h2>
        </div>

        <div className="p-4 space-y-4">
          {notes.length === 0 && <p className="text-sm text-gray-500">No notes yet.</p>}
          {notes.map((note) => (
            <div key={note.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">{note.author || 'Unknown'}</span>
                <span className="text-xs text-gray-400">{fmt(note.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{note.content}</p>
            </div>
          ))}
        </div>

        <form onSubmit={addNote} className="p-4 border-t flex gap-2">
          <input
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button
            type="submit"
            disabled={sending || !noteContent.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
          >
            <Send size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
      <p className="text-sm text-gray-900 mt-0.5">{value || '-'}</p>
    </div>
  );
}
