import { useState } from 'react';
import { useApiStore } from '../store/useApiStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/AddDomainstyle.css';

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
    <div className="add-domain-container">
      <div className="add-domain-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">Dokumentasi API</h1>
          <div className="title-underline"></div>
        </div>

        {/* Form Card */}
        <div className="form-card">
          <div className="form-header">
            <h2 className="form-title">
              <div className="form-icon">
                <span></span>
              </div>
              Tambah Domain Baru
            </h2>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label htmlFor="domainInput" className="form-label">
                Masukkan Domain <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <input
                  type="text"
                  id="domainInput"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="https://api.example.com"
                  className="form-input"
                />
                <div className="input-icon">
                  <span></span>
                </div>
              </div>
              <div className="input-hint">
                Format: https://domain.com atau http://subdomain.domain.com
              </div>
            </div>

            {/* Submit Button */}
            <div className="submit-section">
              <button
                onClick={handleSubmit}
                className="submit-button"
              >
                <div className="button-icon">
                  <span>+</span>
                </div>
                Tambah Domain
              </button>
            </div>
          </div>
        </div>

        {/* Existing Domains Card */}
        {domains.length > 0 && (
          <div className="domains-card">
            <div className="domains-header">
              <h3 className="domains-title">
                <div className="domains-icon">
                  <span>📋</span>
                </div>
                Domain Terdaftar ({domains.length})
              </h3>
            </div>
            <div className="domains-list">
              {domains.map((domain, index) => (
                <div key={index} className="domain-item">
                  <div className="domain-indicator"></div>
                  <span className="domain-url">{domain}</span>
                  <div className="domain-status">
                    <span className="status-badge">Active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="info-card">
          <div className="info-content">
            <div className="info-icon">
              <span>ⓘ</span>
            </div>
            <div className="info-text">
              <p className="info-title">Tips Penggunaan:</p>
              <ul className="info-list">
                <li> Domain harus dimulai dengan http:// atau https://</li>
                <li> Pastikan domain dapat diakses dan valid</li>
                <li> Duplikasi domain akan otomatis ditolak</li>
                <li> Domain akan digunakan sebagai base URL untuk endpoint</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}