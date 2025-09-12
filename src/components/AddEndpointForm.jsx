import { useState, useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'react-toastify';
import { base_url } from '../store/useApiStore';
import axios from 'axios';
import {
  PlusIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';

export default function AddEndpoint() {
  const { addEndpoint, domains } = useApiStore();
  const [isDbMode, setIsDbMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [previewJson, setPreviewJson] = useState(null);
  const [jsonError, setJsonError] = useState(null);
  
  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [modeButtonsVisible, setModeButtonsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [tipsVisible, setTipsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [modeTransition, setModeTransition] = useState(false);

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
    // Trigger animations with staggered timing
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setModeButtonsVisible(true), 300);
    setTimeout(() => setFormVisible(true), 500);
    setTimeout(() => setTipsVisible(true), 700);
    setTimeout(() => setIsVisible(true), 200);
  }, []);

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

  const handleModeChange = (mode) => {
    setModeTransition(true);
    setTimeout(() => {
      setIsDbMode(mode);
      setModeTransition(false);
    }, 200);
  };

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

    setIsSubmitting(true);

    const payload = {
      ...form,
      method: form.method.toUpperCase(),
      websites: form.websites
        ? form.websites.split(',').map(w => w.trim())
        : [],
      response: json
    };

    setTimeout(() => {
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
      setIsSubmitting(false);
    }, 1000);
  };

  const generateFromFormData = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
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
      setIsGenerating(false);
    }, 800);
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
        <div 
          className="text-center mb-8"
          style={{
            transform: headerVisible ? 'translateY(0)' : 'translateY(-30px)',
            opacity: headerVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <h1 className="text-3xl font-bold text-gray-700">
            Dokumentasi API
          </h1>
          <p 
            className="text-gray-500 mt-1 text-sm"
            style={{
              transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: headerVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
            }}
          >
            Kelola dan tambahkan endpoint REST API Anda
          </p>
        </div>

        {/* Tombol mode di atas card form */}
        <div 
          className="flex justify-end mb-4"
          style={{
            transform: modeButtonsVisible ? 'translateX(0)' : 'translateX(30px)',
            opacity: modeButtonsVisible ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <div className="space-x-2">
            <button
              onClick={() => handleModeChange(false)}
              className={`px-4 py-2 rounded text-sm font-semibold border transition-all duration-300 ${
                !isDbMode
                  ? 'bg-blue-600 text-white border-blue-600 transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-100 border-gray-300 hover:scale-105'
              }`}
              style={{
                transform: modeButtonsVisible ? 'translateY(0)' : 'translateY(-10px)',
                opacity: modeButtonsVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.1s'
              }}
            >
              Manual
            </button>
            <button
              onClick={() => handleModeChange(true)}
              className={`px-4 py-2 rounded text-sm font-semibold border transition-all duration-300 ${
                isDbMode
                  ? 'bg-blue-600 text-white border-blue-600 transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-blue-100 border-gray-300 hover:scale-105'
              }`}
              style={{
                transform: modeButtonsVisible ? 'translateY(0)' : 'translateY(-10px)',
                opacity: modeButtonsVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
              }}
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
            style={{
              transform: formVisible ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)',
              opacity: formVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              filter: modeTransition ? 'blur(2px)' : 'blur(0px)'
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.transition = 'all 0.3s ease';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div 
              className="flex items-center mb-4"
              style={{
                transform: formVisible ? 'translateX(0)' : 'translateX(-20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
              }}
            >
              <PlusIcon 
                className="w-5 h-5 text-blue-600 mr-2"
                style={{
                  transform: formVisible ? 'rotate(0deg) scale(1)' : 'rotate(-90deg) scale(0.8)',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
                }}
              />
              <h2 className="text-lg font-semibold text-gray-800">Koneksi Rest API</h2>
            </div>

            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(15px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Pilih Domain <span className="text-red-500">*</span></label>
                <select
                  name="baseUrl"
                  value={form.baseUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
                >
                  <option value="Develop">Develop</option>
                  <option value="Production">Production</option>
                </select>
              </div>
            </div>

            {/* Jika mode Database, tampilkan pilihan Proyek */}
            {isDbMode && (
              <div
                style={{
                  transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                  opacity: formVisible ? 1 : 0,
                  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
                }}
              >
                <label className="block text-sm font-medium mb-1">
                  Nama Proyek <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedProject}
                  onChange={(e) => handleProjectSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
                >
                  <option value="">-- Pilih Proyek --</option>
                  {projects.map((p, i) => (
                    <option key={i} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Method & Path */}
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-1">Method</label>
                <select
                  name="method"
                  value={form.method}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
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
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s'
              }}
            >
              <label className="block text-sm font-medium mb-1">Deskripsi</label>
              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
              />
            </div>

            {/* Websites */}
            <div
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s'
              }}
            >
              <label className="block text-sm font-medium mb-1">Websites</label>
              <input
                type="text"
                name="websites"
                value={form.websites}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-105"
              />
            </div>

            {/* Response JSON */}
            <div
              style={{
                transform: formVisible ? 'translateY(0)' : 'translateY(25px)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
              }}
            >
              <label className="block text-sm font-medium mb-1">Response JSON</label>
              <textarea
                name="response"
                value={form.response}
                onChange={handleChange}
                rows="6"
                className="w-full border border-gray-300 rounded-md p-2 font-mono focus:ring-2 focus:ring-blue-500 transition-all duration-300 focus:scale-[1.02]"
              />
              
              {/* Tombol Action: Generate & Simpan */}  
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                {isDbMode ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedProject) {
                        toast.warning("Pilih proyek terlebih dahulu");
                        return;
                      }
                      setIsGenerating(true);
                      setTimeout(() => {
                        handleProjectSelect(selectedProject);
                        toast.success("Response JSON digenerate dari proyek");
                        setIsGenerating(false);
                      }, 800);
                    }}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      style={{
                        transform: isGenerating ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.5s ease',
                        display: 'inline-block'
                      }}
                    >
                      {isGenerating ? '🔄' : ''}
                    </span>
                    {isGenerating ? ' Generating...' : 'Generate dari proyek'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={generateFromFormData}
                    disabled={isGenerating}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span
                      style={{
                        transform: isGenerating ? 'rotate(360deg)' : 'rotate(0deg)',
                        transition: 'transform 0.5s ease',
                        display: 'inline-block'
                      }}
                    >
                      {isGenerating ? '⚡' : ''}
                    </span>
                    {isGenerating ? ' Generating...' : 'Generate dari inputan'}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded font-semibold text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <PlusIcon 
                    className="w-5 h-5"
                    style={{
                      transform: isSubmitting ? 'rotate(180deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Endpoint'}
                </button>
              </div>

              {jsonError && (
                <p 
                  className="text-red-500 mt-1 text-sm"
                  style={{
                    animation: 'shake 0.5s ease-in-out'
                  }}
                >
                  {jsonError}
                </p>
              )}
            </div>
          </form>

          {/* Tips Card */}
          <aside 
            className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm h-fit"
            style={{
              transform: tipsVisible ? 'translateX(0) scale(1)' : 'translateX(30px) scale(0.95)',
              opacity: tipsVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-5px) scale(1.02)';
              e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
              e.target.style.transition = 'all 0.3s ease';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
            }}
          >
            <div 
              className="flex items-center gap-2 font-semibold text-gray-800 mb-2"
              style={{
                transform: tipsVisible ? 'translateY(0)' : 'translateY(-10px)',
                opacity: tipsVisible ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
              }}
            >
              <LightBulbIcon 
                className="w-5 h-5 text-yellow-500"
                style={{
                  transform: tipsVisible ? 'rotate(0deg) scale(1)' : 'rotate(-15deg) scale(0.8)',
                  transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
                }}
              />
              Tips Pengisian
            </div>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {[
                'Gunakan IP public Anda',
                'Jika port dikosongkan, sistem akan menggunakan default',
                'Pastikan response JSON valid',
                'Gunakan mode database untuk generate otomatis'
              ].map((tip, index) => (
                <li 
                  key={index}
                  style={{
                    transform: tipsVisible ? 'translateX(0)' : 'translateX(-15px)',
                    opacity: tipsVisible ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.4 + index * 0.1}s`
                  }}
                >
                  {tip}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}