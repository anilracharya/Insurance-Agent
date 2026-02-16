import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Lead, Product, CalendarSlot, ApiResponse } from '../types';
import { Users, Package, CalendarDays, TrendingUp, Plus } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [slots, setSlots] = useState<CalendarSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get<ApiResponse<Lead[]>>('/leads'),
      client.get<ApiResponse<Product[]>>('/products'),
      client.get<ApiResponse<CalendarSlot[]>>('/calendar/slots'),
    ])
      .then(([leadsRes, productsRes, slotsRes]) => {
        setLeads(leadsRes.data.data || []);
        setProducts(productsRes.data.data || []);
        setSlots(slotsRes.data.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  const wonLeads = leads.filter((l) => l.status === 'WON').length;
  const newLeads = leads.filter((l) => l.status === 'NEW').length;
  const upcomingSlots = slots.filter((s) => !s.booked).length;

  const stats = [
    { label: 'Total Leads', value: leads.length, icon: Users, color: 'bg-blue-500' },
    { label: 'New Leads', value: newLeads, icon: TrendingUp, color: 'bg-yellow-500' },
    { label: 'Won Leads', value: wonLeads, icon: TrendingUp, color: 'bg-green-500' },
    { label: 'Products', value: products.length, icon: Package, color: 'bg-purple-500' },
    { label: 'Available Slots', value: upcomingSlots, icon: CalendarDays, color: 'bg-indigo-500' },
  ];

  const recentLeads = [...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <Link to="/leads" className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
            <Plus size={16} /> New Lead
          </Link>
          <Link to="/products" className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
            <Plus size={16} /> New Product
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg border p-4">
            <div className="flex items-center gap-3">
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Recent Leads</h2>
        </div>
        {recentLeads.length === 0 ? (
          <p className="p-4 text-gray-500 text-sm">No leads yet. Create your first lead!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-gray-600">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link to={`/leads/${lead.id}`} className="text-blue-600 hover:underline font-medium">
                        {lead.firstName} {lead.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{lead.email}</td>
                    <td className="px-4 py-3"><Badge status={lead.status} /></td>
                    <td className="px-4 py-3 text-gray-600">{lead.source || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
