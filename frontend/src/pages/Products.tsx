import { useEffect, useState } from 'react';
import client from '../api/client';
import type { Product, ProductRequest, ProductCategory, ApiResponse } from '../types';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import Modal from '../components/ui/Modal';

const emptyForm: ProductRequest = { name: '', description: '', categoryId: '', premiumRange: '', coverageAmount: '', features: '' };

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductRequest>(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        client.get<ApiResponse<Product[]>>('/products'),
        client.get<ApiResponse<ProductCategory[]>>('/product-categories'),
      ]);
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description || '',
      categoryId: p.categoryId,
      premiumRange: p.premiumRange || '',
      coverageAmount: p.coverageAmount || '',
      features: p.features || '',
      active: p.active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await client.put(`/products/${editing.id}`, form);
      } else {
        await client.post('/products', form);
      }
      setModalOpen(false);
      fetchData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await client.delete(`/products/${id}`);
    fetchData();
  };

  const toggleActive = async (p: Product) => {
    await client.put(`/products/${p.id}`, { ...p, active: !p.active });
    fetchData();
  };

  const update = (field: string, value: string | boolean) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button onClick={openCreate} className="flex items-center gap-1 px-3 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" /></div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-lg border p-8 text-center">
          <Package size={48} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">No products yet. Create your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-purple-600 mt-0.5">{product.categoryName}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(product)} className="text-gray-400 hover:text-blue-600">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              {product.description && <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>}
              <div className="mt-3 space-y-1 text-sm">
                {product.premiumRange && <p className="text-gray-500">Premium: <span className="text-gray-900">{product.premiumRange}</span></p>}
                {product.coverageAmount && <p className="text-gray-500">Coverage: <span className="text-gray-900">{product.coverageAmount}</span></p>}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => toggleActive(product)}
                  className={`text-xs px-2 py-1 rounded-full ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}
                >
                  {product.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Product' : 'New Product'}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select value={form.categoryId} onChange={(e) => update('categoryId', e.target.value)} required className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none">
              <option value="">Select category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Premium Range</label>
              <input value={form.premiumRange} onChange={(e) => update('premiumRange', e.target.value)} placeholder="$100-500" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coverage Amount</label>
              <input value={form.coverageAmount} onChange={(e) => update('coverageAmount', e.target.value)} placeholder="$1,000,000" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Features</label>
            <textarea value={form.features} onChange={(e) => update('features', e.target.value)} rows={2} placeholder="Key features..." className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
          </div>
          {editing && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.active ?? true} onChange={(e) => update('active', e.target.checked)} className="rounded" />
              Active
            </label>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
