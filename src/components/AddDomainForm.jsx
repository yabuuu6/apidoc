import { useState } from 'react';
import { useApiStore } from '../store/useApiStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function AddDomainForm() {
  const [newDomain, setNewDomain] = useState('');
  const { domains, fetchDomains } = useApiStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedDomain = newDomain.trim();
    if (!trimmedDomain) return toast.info("Domain tidak boleh kosong!");
    if (!/^https?:\/\/.+\..+/.test(trimmedDomain)) return toast.error("Domain tidak valid!");

    const isDuplicate = domains.includes(trimmedDomain);
    if (isDuplicate) {
      return toast.warning("Domain sudah ada!");
    }

    try {
      await axios.post(`${base_url}/domain/post`, { url: trimmedDomain }, {
        headers: { 'Content-Type': 'application/json' }
      });

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
    <div className="container my-4">
      <form onSubmit={handleSubmit}>
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-center mb-3">Tambah Domain</h5>

            <div className="mb-3">
              <label htmlFor="domainInput" className="form-label fw-semibold">
                Masukkan Domain
              </label>
              <input
                type="text"
                id="domainInput"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                placeholder="https://example.com"
                className="form-control"
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Tambah Domain
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
