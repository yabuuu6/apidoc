import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import EndpointList from "../components/EndpointList";
import AddEndpointForm from "../components/AddEndpointForm";

export default function HomePage() {
  const {
    statusFilter,
    setStatusFilter,
    fetchEndpoints,
    fetchDomains,
  } = useApiStore();

  const [domainSearch, setDomainSearch] = useState("");

  useEffect(() => {
    // Reset filter & fetch data dari server
    setStatusFilter("");
    setDomainSearch("");
    fetchEndpoints();
    fetchDomains();
  }, [fetchEndpoints, fetchDomains, setStatusFilter]);

  return (
    <div className="container mt-4">
      <h1 className="fw-bold mb-4 text-center">
        <i className="bi bi-journal-code me-2"></i> Dokumentasi API
      </h1>

      {/* Filter Bar */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Cari Domain</label>
          <input
            type="text"
            className="form-control"
            placeholder="Contoh: api.example.com"
            value={domainSearch}
            onChange={(e) => setDomainSearch(e.target.value)}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label fw-semibold">Filter Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="Develop">Develop</option>
            <option value="Production">Production</option>
          </select>
        </div>
      </div>
      {/* Daftar Endpoint */}
      <EndpointList domainSearch={domainSearch} />
    </div>
  );
}
