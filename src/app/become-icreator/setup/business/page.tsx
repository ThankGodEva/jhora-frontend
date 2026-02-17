'use client';

import ImageUpload from '@/components/ImageUpload';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import api from '@/lib/api';

export default function BusinessSetup() {
  const router = useRouter();

  const [form, setForm] = useState({
    business_type: '',
    business_category: '',
    store_name: '',
    store_url: '',
    business_address: '',
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string>('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError(`${type === 'cover' ? 'Cover photo' : 'Logo'} must be less than 5MB`);
      return;
    }

    if (type === 'cover') {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();

    formData.append('business_type', form.business_type);
    formData.append('business_category', form.business_category);
    formData.append('store_name', form.store_name);
    formData.append('store_url', form.store_url);
    formData.append('business_address', form.business_address);

    if (coverFile) formData.append('cover_photo', coverFile);
    if (logoFile) formData.append('logo', logoFile);

    try {
      const res = await api.post('/vendor/setup/business', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      router.push('/become-icreator/setup/shipping');
    } catch (err: any) {
      const response = err.response?.data;
      if (response?.errors) {
        const details = Object.entries(response.errors)
          .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
          .join('\n');
        setError(`Validation failed:\n${details}`);
      } else {
        setError(response?.message || 'Failed to save business information');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Account setup">
      <div className="mt-4 flex justify-between text-sm font-medium">
        <span className="text-orange-600">Personal Information</span>
        <span className="text-gray-400">Shipping</span>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-8">
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Business information</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Type *</label>
            <select
              required
              value={form.business_type}
              onChange={(e) => setForm({ ...form, business_type: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Select type</option>
              <option value="sole_proprietor">Sole Proprietor</option>
              <option value="limited_company">Limited Company</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Category *</label>
            <select
              required
              value={form.business_category}
              onChange={(e) => setForm({ ...form, business_category: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
            >
              <option value="">Select category</option>
              <option value="fashion">Fashion & Clothing</option>
              <option value="bags">Bags & Purses</option>
              <option value="jewelry">Jewelry & Accessories</option>
              <option value="home">Home & Living</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Store name *</label>
            <input
              type="text"
              required
              value={form.store_name}
              onChange={(e) => setForm({ ...form, store_name: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="@Tenibags"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Store URL *</label>
            <div className="mt-1 flex rounded-lg border border-gray-300 focus-within:border-orange-500">
              <span className="inline-flex items-center rounded-l-lg border-r border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                jhora.com.ng/
              </span>
              <input
                type="text"
                required
                value={form.store_url}
                onChange={(e) => setForm({ ...form, store_url: e.target.value })}
                className="block w-full min-w-0 rounded-r-lg px-3 py-3 focus:outline-none"
                placeholder="tenibags"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Business Address *</label>
            <input
              type="text"
              required
              value={form.business_address}
              onChange={(e) => setForm({ ...form, business_address: e.target.value })}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-3"
              placeholder="Full business address"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Cover photo (recommended size: 1200x400)"
              onUpload={(file) => {
                setCoverFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setCoverPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
              preview={coverPreview}
            />

            <ImageUpload
              label="Business logo (recommended size: 200x200)"
              onUpload={(file) => {
                setLogoFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setLogoPreview(reader.result as string);
                reader.readAsDataURL(file);
              }}
              preview={logoPreview}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-600 text-white py-4 rounded-full font-medium hover:bg-orange-700 transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & continue'}
        </button>
      </form>
    </AuthLayout>
  );
}