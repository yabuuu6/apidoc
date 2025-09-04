import { useState } from "react";
import { toast } from "react-toastify";
import { useApiStore } from "../store/useApiStore";
import { base_url } from '../store/useApiStore';
import axios from "axios";

import "../style/AddRestApistyle.css";

export default function AddRestApiForm() {
  const [form, setForm] = useState({
    projectName: "",
    engine: "",
    ip: "",
    port: "",
    username: "",
    password: "",
    database_name: "",
  });

  const [tables, setTables] = useState([]);
  const [loadingTest, setLoadingTest] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableStructure, setTableStructure] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const addRestApi = useApiStore((state) => state.addRestApi);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescribeTable = async (tableName) => {
    const { engine, ip, port, username, password, database_name } = form;

    // Jika table yang sama diklik, tutup struktur
    if (selectedTable === tableName) {
      setSelectedTable(null);
      setTableStructure([]);
      return;
    }

    try {
      setLoadingTable(true);
      const payload = {
        engine,
        ip,
        port: port ? parseInt(port) : undefined,
        username,
        password,
        database_name,
        table: tableName,
      };

      const res = await axios.post(`${base_url}/describe`, payload);
      setSelectedTable(tableName);
      setTableStructure(res.data.structure || []);
    } catch (err) {
      console.error("Gagal ambil struktur tabel:", err);
      toast.error("Gagal ambil struktur tabel");
      setSelectedTable(null);
      setTableStructure([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleTestConnection = async () => {
    const { engine, ip, port, username, password, database_name } = form;

    if (!engine || !ip || !username || !database_name) {
      toast.warning("Field dengan tanda * wajib diisi untuk test koneksi!");
      return;
    }

    try {
      setLoadingTest(true);
      const payload = {
        engine,
        ip,
        port: port ? parseInt(port) : undefined,
        username,
        password,
        database_name,
      };

      const res = await axios.post(`${base_url}/testconn`, payload);
      setTables(res.data.tables || []);
      toast.success("Koneksi berhasil! Tabel ditemukan.");
    } catch (err) {
      console.error("Gagal test koneksi:", err);
      toast.error(err?.response?.data?.error || "Gagal koneksi ke database");
      setTables([]);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { projectName, engine, ip, username, database_name } = form;

    if (!projectName.trim() || !engine.trim() || !ip.trim() || !username.trim() || !database_name.trim()) {
      toast.warning("Field dengan tanda * wajib diisi!");
      return;
    }

    const payload = {
      ...form,
      port: form.port ? parseInt(form.port) : undefined,
      password: form.password || "",
    };

    try {
      await addRestApi(payload);
      toast.success("REST API berhasil ditambahkan!");
      setForm({
        projectName: "",
        engine: "",
        ip: "",
        port: "",
        username: "",
        password: "",
        database_name: "",
      });
      setTables([]);
      setSelectedTable(null);
      setTableStructure([]);
    } catch (err) {
      console.error("Gagal menyimpan REST API:", err);
      const msg = err?.response?.data?.error || err.message || "Terjadi kesalahan";
      toast.error(msg);
    }
  };

  return (
    <div className="add-endpoint-container">
      <div className="add-endpoint-wrapper">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">Dokumentasi API</h1>
          <div className="title-underline"></div>
        </div>

        {/* Form */}
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-header">
            <h2 className="form-title">
              <div className="form-icon"><span></span></div>
              Form Tambah REST API
            </h2>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label className="form-label">Nama Proyek <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="Contoh: API Keuangan Mahasiswa"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Platform Database <span className="required">*</span></label>
              <select className="form-select" name="engine" value={form.engine} onChange={handleChange}>
                <option value="">-- Pilih Platform --</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">IP Lokal / Host <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                name="ip"
                value={form.ip}
                onChange={handleChange}
                placeholder="Contoh: 127.0.0.1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Port <span className="label-hint">(opsional)</span></label>
              <input
                type="number"
                className="form-input"
                name="port"
                value={form.port}
                onChange={handleChange}
                placeholder="Contoh: 3306"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Contoh: root"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ada password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Nama Database <span className="required">*</span></label>
              <input
                type="text"
                className="form-input"
                name="database_name"
                value={form.database_name}
                onChange={handleChange}
                placeholder="Contoh: api_db"
              />
            </div>

            <div className="submit-section">
              <button
                type="button"
                className="test-button"
                onClick={handleTestConnection}
                disabled={loadingTest}
              >
                {loadingTest ? "Menghubungkan..." : "Test Koneksi"}
              </button>

              <button type="submit" className="submit-button">
                <div className="button-icon"><span>+</span></div>
                Simpan REST API
              </button>
            </div>
          </div>
        </form>

        {/* Tabel Cards - Struktur yang Diperbaiki */}
        {tables.length > 0 && (
          <div className="tables-section">
            <h3>🗂️ Tabel Database ({tables.length} tabel ditemukan)</h3>
            <div className="table-cards-wrapper">
              {tables.map((row, idx) => {
                const tableName = Object.values(row)[0];
                const isSelected = selectedTable === tableName;
                const isLoading = loadingTable && selectedTable === tableName;
                
                return (
                  <div
                    key={idx}
                    className={`table-card ${isSelected ? "selected" : ""}`}
                  >
                    {/* Header Tabel yang Diperbaiki */}
                    <div className="table-card-header">
                      <div className="table-info">
                        <div className="table-icon">📋</div>
                        <div className="table-details">
                          <h4>{tableName}</h4>
                          <span className="table-status">
                            {isSelected 
                              ? `Struktur ditampilkan ${tableStructure.length ? `(${tableStructure.length} kolom)` : ''}` 
                              : "Klik tombol untuk melihat struktur"
                            }
                          </span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        className={`view-table-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => handleDescribeTable(tableName)}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <div className="btn-spinner"></div>
                            <span>Loading...</span>
                          </>
                        ) : isSelected ? (
                          <>
                            <span>👁️</span>
                            <span>Tutup</span>
                          </>
                        ) : (
                          <>
                            <span>🔍</span>
                            <span>Lihat Tabel</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Structure Table - Dalam Card yang Diperbaiki */}
                    {isSelected && tableStructure.length > 0 && (
                      <div className="table-structure">
                        <div className="structure-header">
                          <h5>
                            📊 Struktur Tabel: <code>{tableName}</code>
                          </h5>
                          <span className="column-count">
                            {tableStructure.length} kolom
                          </span>
                        </div>
                        
                        <div className="table-wrapper">
                          <table>
                            <thead>
                              <tr>
                                {tableStructure.length > 0 && Object.keys(tableStructure[0]).map((key) => (
                                  <th key={key}>{key}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {tableStructure.map((col, i) => (
                                <tr key={i}>
                                  {Object.values(col).map((val, j) => (
                                    <td key={j}>
                                      <span className="cell-content">{val || '-'}</span>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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