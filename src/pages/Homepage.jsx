import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import EndpointList from "../components/EndpointList";
import '../style/HomePage.css';

export default function HomePage() {
  const {
    statusFilter,
    setStatusFilter,
    fetchEndpoints,
    fetchDomains,
  } = useApiStore();

  const [domainSearch, setDomainSearch] = useState("");

  useEffect(() => {
    setStatusFilter("");
    setDomainSearch("");
    fetchEndpoints();
    fetchDomains();
  }, [fetchEndpoints, fetchDomains, setStatusFilter]);

  return (
    <div className="home-container home-spacing-top">
      {/* Header */}
      <h1 className="home-title">
        <i className="bi bi-journal-code"></i>
        Dokumentasi API
      </h1>
      <p className="home-subtitle">
        Kelola dan pantau semua endpoint API Anda dalam satu platform
      </p>
      {/* Main Title */}
      <h2 className="home-main-title">
        Gunakan API Anda dengan Mudah dan Efisien
      </h2>

      {/* Filter Bar */}
      <div className="home-filter-container home-spacing-bottom-large">
        <div className="home-card user-research">
          <div className="home-card-content">
            <div className="home-card-icon">
              <i className="bi bi-search"></i>
            </div>
            <div className="home-card-title">Pencarian Domain</div>
            <div className="home-card-description">
              Cari Domain API
            </div>
            <div className="home-form-group">
              <i className="bi bi-search form-icon"></i>
              <input
                type="text"
                className="home-form-control"
                placeholder="Contoh: api.example.com"
                value={domainSearch}
                onChange={(e) => setDomainSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="home-card testing">
          <div className="home-card-content">
            <div className="home-card-icon">
              <i className="bi bi-toggle-on"></i>
            </div>
            <div className="home-card-title">Status Environment</div>
            <div className="home-card-description">
              Filter Status Environment
            </div>
            <div className="home-form-group">
              <i className="bi bi-funnel form-icon"></i>
              <select
                className="home-form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Semua</option>
                <option value="Develop">Develop</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Endpoint */}
      <EndpointList domainSearch={domainSearch} />
    </div>
  );
}