import { useState, useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'react-toastify';
import { base_url } from '../store/useApiStore';
import axios from 'axios';
import {
  PlusIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

export default function AddEndpoint() {
  const { addEndpoint, domains } = useApiStore();
  const [isDbMode, setIsDbMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [previewJson, setPreviewJson] = useState(null);
  const [jsonError, setJsonError] = useState(null);

  const [form, setForm] = useState({
    baseUrl: '',
    method: 'GET',
    path: '/',
    description: '',
    status: 'Develop',
    websites: '',
    response: ''
  });

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        await axios.get(`${base_url}/domain/get`);
      } catch {
        toast.error('Gagal memuat domain');
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${base_url}/restapi/get`);
        const unique = [...new Set(res.data.map(d => d.projectName).filter(Boolean))];
        setProjects(unique);
      } catch {
        toast.error('Gagal memuat proyek');
      }
    };

    fetchDomains();
    if (isDbMode) fetchProjects();
  }, [isDbMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = name === 'path' && value && !value.startsWith('/')
      ? '/' + value.replace(/^\/+/, '')
      : value;

    setForm(prev => ({ ...prev, [name]: newValue }));

    if (name === 'response') {
      try {
        const parsed = JSON.parse(newValue);
        setPreviewJson(parsed);
        setJsonError(null);
      } catch {
        setPreviewJson(null);
        setJsonError('Format JSON tidak valid');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.baseUrl || !form.path || !form.description || !form.response) {
      toast.warning("Isi semua field wajib!");
      return;
    }

    let json;
    try {
      json = JSON.parse(form.response);
    } catch {
      toast.error("Response JSON tidak valid");
      return;
    }

    const payload = {
      ...form,
      method: form.method.toUpperCase(),
      websites: form.websites
        ? form.websites.split(',').map(w => w.trim())
        : [],
      response: json
    };

    addEndpoint(payload);
    toast.success("Endpoint berhasil ditambahkan!");

    setForm({
      baseUrl: '',
      method: 'GET',
      path: '/',
      description: '',
      status: 'Develop',
      websites: '',
      response: ''
    });
    setSelectedProject('');
    setPreviewJson(null);
    setJsonError(null);
  };

  const generateFromFormData = () => {
    const generated = {
      success: true,
      message: 'Contoh response dari endpoint',
      data: {
        baseUrl: form.baseUrl,
        method: form.method,
        path: form.path,
        description: form.description,
        status: form.status,
        websites: form.websites.split(',').map(w => w.trim())
      }
    };

    setForm(prev => ({
      ...prev,
      response: JSON.stringify(generated, null, 2)
    }));
    setPreviewJson(generated);
    setJsonError(null);
    toast.success("Response JSON digenerate dari input");
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    const path = `/${project.replace(/\s+/g, '-').toLowerCase()}`;
    const method = 'GET';
    const generated = {
      success: true,
      message: `Contoh response dari proyek ${project}`,
      data: { project, path, method }
    };

    setForm(prev => ({
      ...prev,
      method,
      path,
      description: `Endpoint otomatis untuk proyek ${project}`,
      response: JSON.stringify(generated, null, 2)
    }));

    setPreviewJson(generated);
    setJsonError(null);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700">Dokumentasi API</h1>
          <p className="text-gray-500 mt-1 text-sm">Kelola dan tambahkan endpoint REST API Anda</p>
        </div>

        {/* Tombol mode di atas card form */}
        <div className="flex justify-end mb-4">
          <div className="space-x-2">
            <button
              onClick={() => setIsDbMode(false)}
              className={`px-4 py-2 rounded text-sm font-semibold border ${
                !isDbMode
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 hover:bg-blue-100 border-gray-300'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setIsDbMode(true)}
              className={`px-4 py-2 rounded text-sm font-semibold border ${
                isDbMode
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 hover:bg-blue-100 border-gray-300'
              }`}
            >
              Database
            </button>
          </div>
        </div>

        {/* Layout 2 Kolom */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-md space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Pilih Domain <span className="text-red-500">*</span></label>
                <select
                  name="baseUrl"
                  value={form.baseUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Domain --</option>
                  {domains.map((d, i) => (
                    <option key={i} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Develop">Develop</option>
                  <option value="Production">Production</option>
                </select>
              </div>
            </div>

            {isDbMode ? (
              <div>
                <label className="block text-sm font-medium mb-1">Nama Proyek <span className="text-red-500">*</span></label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Proyek --</option>
                  {projects.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Method</label>
                    <select
                      name="method"
                      value={form.method}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Path</label>
                    <input
                      type="text"
                      name="path"
                      value={form.path}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deskripsi</label>
                  <input
                    type="text"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-1">Websites</label>
              <input
                type="text"
                name="websites"
                value={form.websites}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Response JSON</label>
              <textarea
                name="response"
                value={form.response}
                onChange={handleChange}
                rows="6"
                className="w-full border border-gray-300 rounded-md p-2 font-mono focus:ring-2 focus:ring-blue-500"
              />
              {!isDbMode && (
                <button
                  type="button"
                  onClick={generateFromFormData}
                  className="mt-1 text-sm text-blue-600 hover:underline"
                >
                  Generate dari inputan
                </button>
              )}
              {jsonError && <p className="text-red-500 mt-1 text-sm">{jsonError}</p>}
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white hover:bg-green-700 rounded-md font-semibold"
              >
                <PlusIcon className="w-5 h-5" />
                Simpan Endpoint
              </button>
            </div>
          </form>

          {/* Tips Card */}
          <aside className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm h-fit">
            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              Tips Pengisian
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>Gunakan IP public Anda</li>
              <li>Jika port dikosongkan, sistem akan menggunakan default</li>
              <li>Pastikan response JSON valid</li>
              <li>Gunakan mode database untuk generate otomatis</li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
