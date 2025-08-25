import { useState } from 'react';
import { useApiStore } from '../store/useApiStore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddEndpointForm() {
  const { addEndpoint, domains } = useApiStore();

  const [form, setForm] = useState({
    baseUrl: '',
    method: 'GET',
    path: '',
    description: '',
    status: 'Develop',
    websites: '',
    response: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi form
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

    // Reset form
    setForm({
      baseUrl: '',
      method: 'GET',
      path: '',
      description: '',
      status: 'Develop',
      websites: '',
      response: ''
    });
  };

  return (
    <form onSubmit={handleSubmit} className="container my-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Tambah Endpoint</h4>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Pilih Domain</label>
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

            <div className="col-md-6">
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

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Method</label>
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

            <div className="col-md-6">
              <label className="form-label">Path</label>
              <input
                type="text"
                name="path"
                value={form.path}
                onChange={handleChange}
                placeholder="/api/example"
                className="form-control"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control"
              rows="2"
              placeholder="Deskripsi endpoint"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Websites (pisahkan dengan koma)</label>
            <input
              type="text"
              name="websites"
              value={form.websites}
              onChange={handleChange}
              placeholder="example.com, another.com"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Response JSON</label>
            <textarea
              name="response"
              value={form.response}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder='Contoh: {"success": true}'
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Simpan Endpoint
          </button>
        </div>
      </div>
    </form>
  );
}
