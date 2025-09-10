import { useState } from 'react';
import { useApiStore } from '../store/useApiStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

const base_url = import.meta.env.VITE_BASE_URL;

export default function AddDomainForm() {
  const [newDomain, setNewDomain] = useState('');
  const { domains, fetchDomains } = useApiStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedDomain = newDomain.trim();

    if (!trimmedDomain) return toast.info("Domain tidak boleh kosong!");
    if (!/^https?:\/\/.+\..+/.test(trimmedDomain)) return toast.error("Domain tidak valid!");
    if (domains.includes(trimmedDomain)) return toast.warning("Domain sudah ada!");

    try {
      await axios.post(`${base_url}/domain/post`, { url: trimmedDomain });
      toast.success("Domain berhasil ditambahkan!");
      setNewDomain('');
      fetchDomains();
    } catch (err) {
      if (err.response?.data?.error === 'Domain sudah ada') {
        toast.warning("Domain sudah ada di database!");
      } else {
        toast.error("Gagal menambahkan domain");
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            <i className="bi bi-journal-code mr-2 text-gray-600"></i>
            Dokumentasi API
          </h1>
          <p className="text-gray-500 text-sm">
            Kelola dan tambahkan domain baru untuk API Anda
          </p>
        </div>

        {/* Form + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col gap-4">
              <div className="flex items-center mb-4">
                <PlusIcon className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-800">Tambah Domain Baru</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label htmlFor="domainInput" className="block text-sm font-medium text-gray-700">
                  Masukkan Domain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="domainInput"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition"
                />
                <p className="text-xs text-gray-500">
                  Format: https://domain.com atau http://subdomain.domain.com
                </p>

                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <PlusIcon className="w-4 h-4" />
                  Tambah Domain
                </button>
              </form>
            </div>

            {/* Domains List */}
            {domains.length > 0 && (
              <div className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 flex flex-col gap-2">
                <div className="flex items-center mb-2">
                  <ClipboardDocumentListIcon className="w-5 h-5 text-gray-700 mr-2" />
                  <h3 className="text-md font-semibold text-gray-800">
                    Domain Terdaftar ({domains.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {domains.map((domain, index) => (
                    <div key={index} className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-100 rounded-md">
                      <span className="text-sm text-gray-800 truncate">{domain}</span>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <aside className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm h-fit flex flex-col">
            <div className="flex items-center gap-2 font-semibold text-gray-700 mb-3">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              Tips Pengisian
            </div>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Domain harus diawali dengan http:// atau https://</li>
              <li>Pastikan domain aktif dan dapat diakses</li>
              <li>Duplikasi domain akan otomatis ditolak</li>
              <li>Domain akan digunakan sebagai base URL endpoint</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
