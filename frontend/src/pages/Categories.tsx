import { useEffect, useState } from 'react';
import client from '../api/client';
import type { ProductCategory, ProductCategoryRequest, ApiResponse } from '../types';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import Modal from '../components/ui/Modal';

export default function Categories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ProductCategory | null>(null);
  const [form, setForm] = useState<ProductCategoryRequest>({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await client.get<ApiResponse<ProductCategory[]>>('/product-categories');
      setCategories(res.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (cat: ProductCategory) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || '' });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/product-categories/${editing.id}`, form);
      } else {
        await client.post('/product-categories', form);
      }
      setModalOpen(false);
      fetchCategories();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await client.delete(`/product-categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Product Categories</h1>
        <button onClick={openCreate} className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" /></div>
      ) : categories.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <FolderTree size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No categories yet. Create your first category!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree size={18} className="text-green-600" />
                  <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(cat)} className="text-gray-400 hover:text-blue-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {cat.description && <p className="text-sm text-gray-600 mt-2">{cat.description}</p>}
              <p className="text-xs text-gray-400 mt-2">Created {new Date(cat.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
