import { useState, useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'react-toastify';
import { base_url } from '../store/useApiStore'; 
import 'react-toastify/dist/ReactToastify.css';
import '../style/AddEndpointstyle.css';
import axios from 'axios';

export default function AddEndpoint() {
  const { addEndpoint, domains } = useApiStore();
  const [isDbMode, setIsDbMode] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [previewJson, setPreviewJson] = useState(null);

  const [form, setForm] = useState({
    baseUrl: '',
    method: 'GET',
    path: '/',
    description: '',
    status: 'Develop',
    websites: '',
    response: ''
  });

  const [jsonError, setJsonError] = useState(null);

  useEffect(() => {
    // Fetch domains saat komponen dimount
    const fetchDomains = async () => {
      try {
        const res = await axios.get(`${base_url}/domain/get`);
        // Update domains di store jika perlu
        console.log('Domains loaded:', res.data);
      } catch (err) {
        console.error('Gagal fetch domains:', err.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${base_url}/restapi/get`);
        const uniqueProjects = [...new Set(res.data.map(item => item.projectName).filter(Boolean))];
        setProjects(uniqueProjects);
      } catch (err) {
        console.error("Gagal mengambil daftar proyek:", err?.response?.data?.error || err.message);
        toast.error("Gagal memuat daftar proyek dari database");
      }
    };

    fetchDomains();
    
    if (isDbMode) {
      fetchProjects();
    }
  }, [isDbMode]);

  // Ubah form
  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'path') {
      if (newValue === '') newValue = '/';
      else if (!newValue.startsWith('/')) newValue = '/' + newValue.replace(/^\/+/, '');
    }

    setForm((prev) => ({ ...prev, [name]: newValue }));

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

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.baseUrl) {
      toast.info("Batal: Domain belum dipilih");
      return;
    }
    if (!form.path || !form.description || !form.response) {
      toast.info("Batal: Isi semua kolom wajib");
      return;
    }

    let responseJson;
    try {
      responseJson = JSON.parse(form.response);
    } catch {
      toast.error("Batal: Response JSON tidak valid!");
      return;
    }

    const endpoint = {
      ...form,
      method: form.method.toUpperCase(),
      websites: form.websites
        ? form.websites.split(',').map(w => w.trim())
        : [],
      response: responseJson
    };

    addEndpoint(endpoint);
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

  // Generate dari input manual
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

    setForm((prev) => ({
      ...prev,
      response: JSON.stringify(generated, null, 2),
    }));
    setPreviewJson(generated);
    setJsonError(null);
    toast.success("Response JSON digenerate dari inputan");
  };

  // Ketika project dipilih di DB mode
  const handleProjectSelect = (project) => {
    setSelectedProject(project);

    const path = `/${project.replace(/\s+/g, '-').toLowerCase()}`;
    const method = 'GET';
    const generated = {
      success: true,
      message: `Contoh response dari proyek ${project}`,
      data: {
        project,
        path,
        method
      }
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
    <div className="add-endpoint-container">
      <div className="add-endpoint-wrapper">
        <div className="switch-page-btn">
          <button
            onClick={() => setIsDbMode(!isDbMode)}
            className="btn btn-outline-primary"
          >
            {isDbMode ? 'Mode Manual' : 'Mode Database'}
          </button>
        </div>

        <div className="header-section">
          <h1 className="main-title">Dokumentasi API</h1>
          <div className="title-underline"></div>
        </div>

        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">Tambah Endpoint Baru</h2>
          </div>

          <div className="form-content">
            <form onSubmit={handleSubmit}>
              {/* Domain & Status */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Pilih Domain <span className="required">*</span>
                  </label>
                  <select 
                    name="baseUrl" 
                    value={form.baseUrl} 
                    onChange={handleChange} 
                    className="form-select" 
                    required
                  >
                    <option value="">-- Pilih Domain --</option>
                    {domains.map((url, i) => (
                      <option key={i} value={url}>{url}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select 
                    name="status" 
                    value={form.status} 
                    onChange={handleChange} 
                    className="form-select"
                  >
                    <option value="Develop">Develop</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>

              {/* Mode Database */}
              {isDbMode ? (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      Nama Proyek <span className="required">*</span>
                    </label>
                    <select
                      value={selectedProject}
                      onChange={(e) => handleProjectSelect(e.target.value)}
                      className="form-select"
                      required
                    >
                      <option value="">-- Pilih Proyek --</option>
                      {projects.map((name, i) => (
                        <option key={i} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Method <span className="required">*</span>
                      </label>
                      <select 
                        name="method" 
                        value={form.method} 
                        onChange={handleChange} 
                        className="form-select" 
                        required
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Path</label>
                      <input
                        type="text"
                        name="path"
                        value={form.path}
                        onChange={handleChange}
                        className="form-input"
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deskripsi</label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Method & Path */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">
                        Method <span className="required">*</span>
                      </label>
                      <select 
                        name="method" 
                        value={form.method} 
                        onChange={handleChange} 
                        className="form-select" 
                        required
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">
                        Path <span className="required">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="path" 
                        value={form.path} 
                        onChange={handleChange} 
                        className="form-input" 
                        required 
                      />
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div className="form-group">
                    <label className="form-label">
                      Deskripsi <span className="required">*</span>
                    </label>
                    <textarea 
                      name="description" 
                      value={form.description} 
                      onChange={handleChange} 
                      className="form-textarea" 
                      rows="3" 
                      placeholder="Deskripsi endpoint..." 
                      required 
                    />
                  </div>
                </>
              )}

              {/* Websites */}
              <div className="form-group">
                <label className="form-label">
                  Websites <span className="label-hint">(pisahkan dengan koma)</span>
                </label>
                <input 
                  type="text" 
                  name="websites" 
                  value={form.websites} 
                  onChange={handleChange} 
                  placeholder="example.com, another.com" 
                  className="form-input" 
                />
              </div>

              {/* Response JSON */}
              <div className="form-group">
                <label className="form-label">
                  Response JSON <span className="required">*</span>
                </label>
                <textarea
                  name="response"
                  value={form.response}
                  onChange={handleChange}
                  className="form-textarea json-textarea"
                  rows="6"
                  placeholder="Masukkan response JSON..."
                  required
                />
                {!isDbMode && (
                  <button
                    type="button"
                    className="generate-button"
                    onClick={generateFromFormData}
                  >
                    Generate dari Input
                  </button>
                )}
                {jsonError && <div className="json-error">{jsonError}</div>}
              </div>

              {/* Submit */}
              <div className="submit-section">
                <button type="submit" className="submit-button">
                  <span className="button-icon">+</span>
                  Simpan Endpoint
                </button>
              </div>
            </form>
          </div>
        </div>
         {/* Info Tips */}
        <div className="info-card">
          <div className="info-content">
            <div className="info-icon"><span>ⓘ</span></div>
            <div className="info-text">
              <p className="info-title">Tips Penggunaan:</p>
              <ul className="info-list">
                <li> Isikan nama proyek yang jelas dan deskriptif</li>
                <li> Pilih platform database yang digunakan dalam proyek</li>
                <li> IP Lokal biasanya 127.0.0.1 untuk server lokal</li>
                <li> Jika port dikosongkan, sistem akan menggunakan default</li>
                <li> Nama database harus sesuai dan sudah tersedia</li>
                <li> Klik "Lihat Tabel" untuk melihat struktur detail tabel</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}