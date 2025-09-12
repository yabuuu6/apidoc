import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useApiStore, base_url } from "../store/useApiStore";
import axios from "axios";
import '../index.css';
import { PlusIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon } from '@heroicons/react/24/outline';

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

  // Animation states
  const [isVisible, setIsVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [tipsVisible, setTipsVisible] = useState(false);
  const [tablesVisible, setTablesVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRestApi = useApiStore((state) => state.addRestApi);

  useEffect(() => {
    // Trigger animations with staggered timing
    setTimeout(() => setHeaderVisible(true), 100);
    setTimeout(() => setFormVisible(true), 400);
    setTimeout(() => setTipsVisible(true), 600);
    setTimeout(() => setIsVisible(true), 200);
  }, []);

  useEffect(() => {
    if (tables.length > 0) {
      setTimeout(() => setTablesVisible(true), 300);
    } else {
      setTablesVisible(false);
    }
  }, [tables]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      toast.error("Gagal koneksi ke database");
      setTables([]);
    } finally {
      setLoadingTest(false);
    }
  };

  const handleDescribeTable = async (tableName) => {
    const { engine, ip, port, username, password, database_name } = form;

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
      toast.error("Gagal ambil struktur tabel");
      setSelectedTable(null);
      setTableStructure([]);
    } finally {
      setLoadingTable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { projectName, engine, ip, username, database_name } = form;

    if (!projectName || !engine || !ip || !username || !database_name) {
      toast.warning("Field dengan tanda * wajib diisi!");
      return;
    }

    const payload = {
      ...form,
      port: form.port ? parseInt(form.port) : undefined,
      password: form.password || "",
    };

    try {
      setIsSubmitting(true);
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
      toast.error("Gagal menyimpan REST API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div 
        className="text-center mb-10"
        style={{
          transform: headerVisible ? 'translateY(0)' : 'translateY(-30px)',
          opacity: headerVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}
      >
        <h1 className="text-4xl font-bold mb-2">
          Dokumentasi API
        </h1>
        <p 
          className="text-gray-500"
          style={{
            transform: headerVisible ? 'translateY(0)' : 'translateY(10px)',
            opacity: headerVisible ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
          }}
        >
          Buat koneksi database untuk endpoint REST API
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* FORM KONEKSI */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white border border-gray-200 shadow-md rounded-xl p-6 space-y-6"
          style={{
            transform: formVisible ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)',
            opacity: formVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
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
            <h2 className="text-lg font-semibold text-gray-800">Koneksi Database</h2>
          </div>

          <div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{
              transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: formVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
            }}
          >
            {/* Nama Proyek */}
            <div>
              <label className="block mb-1 font-semibold text-sm">Nama Proyek <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="Contoh: API Project"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Engine */}
            <div>
              <label className="block mb-1 font-semibold text-sm">Engine <span className="text-red-500">*</span></label>
              <select
                name="engine"
                value={form.engine}
                onChange={handleChange}
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">-- Pilih Platform --</option>
                <option value="MySQL">MySQL</option>
                <option value="PostgreSQL">PostgreSQL</option>
              </select>
            </div>

            {/* IP */}
            <div>
              <label className="block mb-1 font-semibold text-sm">IP / Host <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="ip"
                value={form.ip}
                onChange={handleChange}
                placeholder="127.0.0.1"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Port */}
            <div>
              <label className="block mb-1 font-semibold text-sm">Port</label>
              <input
                type="number"
                name="port"
                value={form.port}
                onChange={handleChange}
                placeholder="3306 / 5432"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Username */}
            <div>
              <label className="block mb-1 font-semibold text-sm">Username <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="root / admin"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-semibold text-sm">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Opsional"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            {/* Database Name */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-sm">Nama Database <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="database_name"
                value={form.database_name}
                onChange={handleChange}
                placeholder="contoh_db"
                className="input-field"
                style={{
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          <div 
            className="flex justify-end gap-4"
            style={{
              transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
              opacity: formVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
            }}
          >
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={loadingTest}
              className={`btn transition-all duration-300 hover:scale-105 ${loadingTest ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              style={{
                transform: loadingTest ? 'scale(0.98)' : 'scale(1)',
                opacity: loadingTest ? 0.7 : 1
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  transform: loadingTest ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s ease'
                }}
              >
                {loadingTest ? '🔄' : '🔗'}
              </span>
              {loadingTest ? " Menghubungkan..." : " Test Koneksi"}
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn bg-green-600 text-white hover:bg-green-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon 
                className="inline-block w-4 h-4 mr-1"
                style={{
                  transform: isSubmitting ? 'rotate(180deg) scale(1.2)' : 'rotate(0deg) scale(1)',
                  transition: 'transform 0.3s ease'
                }}
              />
              {isSubmitting ? 'Menyimpan...' : 'Simpan REST API'}
            </button>
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
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            {[
              'Gunakan nama Proyek yang deskriptif dan unik.',
              'Sesuaikan engine database yang anda gunakan.',
              'Gunakan IP/Host untuk lokal atau alamat server.',
              'Kosongkan port untuk default (MySQL: 3306, PostgreSQL: 5432).',
              'Gunakan user dan password database yang memiliki akses ke database.'
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

      {/* Tabel Hasil Koneksi */}
      {tables.length > 0 && (
        <div 
          className="max-w-7xl mx-auto mt-10 space-y-4"
          style={{
            transform: tablesVisible ? 'translateY(0)' : 'translateY(30px)',
            opacity: tablesVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <h2 
            className="text-lg font-semibold text-center"
            style={{
              transform: tablesVisible ? 'scale(1)' : 'scale(0.9)',
              opacity: tablesVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
            }}
          >
            Tabel Ditemukan ({tables.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tables.map((row, idx) => {
              const tableName = Object.values(row)[0];
              const isSelected = selectedTable === tableName;
              const isLoading = loadingTable && isSelected;

              return (
                <div
                  key={idx}
                  className={`border rounded-xl shadow-sm p-4 transition-all duration-300 ${
                    isSelected ? "border-blue-500 bg-blue-50" : "bg-white hover:shadow-md"
                  }`}
                  style={{
                    transform: tablesVisible ? 'translateX(0) scale(1)' : 'translateX(-20px) scale(0.95)',
                    opacity: tablesVisible ? 1 : 0,
                    transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.3 + idx * 0.1}s`
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">
                      <span
                        style={{
                          display: 'inline-block',
                          transform: tablesVisible ? 'rotate(0deg)' : 'rotate(-180deg)',
                          transition: `transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.4 + idx * 0.05}s`
                        }}
                      >
                        📋
                      </span>
                      {' '}{tableName}
                    </span>
                    <button
                      onClick={() => handleDescribeTable(tableName)}
                      className={`text-sm px-3 py-1 rounded transition-all duration-300 hover:scale-105 ${
                        isSelected
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                      style={{
                        transform: isLoading ? 'scale(0.95)' : 'scale(1)',
                        opacity: isLoading ? 0.7 : 1
                      }}
                    >
                      {isLoading ? (
                        <span
                          style={{
                            display: 'inline-block',
                            transform: 'rotate(360deg)',
                            transition: 'transform 0.5s linear infinite'
                          }}
                        >
                          ⏳
                        </span>
                      ) : isSelected ? (
                        "Tutup"
                      ) : (
                        "Lihat Tabel"
                      )}
                    </button>
                  </div>

                  {isSelected && tableStructure.length > 0 && (
                    <div 
                      className="overflow-x-auto"
                      style={{
                        opacity: isSelected ? 1 : 0,
                        maxHeight: isSelected ? '400px' : '0px',
                        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                      }}
                    >
                      <table className="w-full text-sm border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            {Object.keys(tableStructure[0]).map((key, keyIdx) => (
                              <th 
                                key={key} 
                                className="p-2 border-b"
                                style={{
                                  transform: isSelected ? 'translateY(0)' : 'translateY(-10px)',
                                  opacity: isSelected ? 1 : 0,
                                  transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${keyIdx * 0.05}s`
                                }}
                              >
                                {key}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableStructure.map((col, i) => (
                            <tr 
                              key={i}
                              style={{
                                transform: isSelected ? 'translateX(0)' : 'translateX(-10px)',
                                opacity: isSelected ? 1 : 0,
                                transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.1 + i * 0.05}s`
                              }}
                            >
                              {Object.values(col).map((val, j) => (
                                <td key={j} className="p-2 border-t text-xs">{val}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .btn {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        }
        
        .input-field {
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}