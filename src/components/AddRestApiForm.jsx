import { useState } from "react";
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

  const addRestApi = useApiStore((state) => state.addRestApi);

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
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 py-10 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2">Dokumentasi API</h1>
        <p className="text-gray-500">Buat koneksi database untuk endpoint REST API</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* FORM KONEKSI */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-2 bg-white border border-gray-200 shadow-md rounded-xl p-6 space-y-6"
        >
          <div className="flex items-center mb-4">
            <PlusIcon className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-800">Koneksi Database</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={loadingTest}
              className={`btn ${loadingTest ? "bg-gray-300 text-gray-500" : "bg-blue-600 text-white hover:bg-blue-700"}`}
            >
              {loadingTest ? "Menghubungkan..." : "Test Koneksi"}
            </button>
            <button type="submit" className="btn bg-green-600 text-white hover:bg-green-700">
              + Simpan REST API
            </button>
          </div>
        </form>

        {/* TIPS PENGISIAN */}
        <div className="bg-white border border-gray-200 shadow-md rounded-xl p-6 space-y-3">
          
          <div className="flex items-center gap-2 font-semibold mb-2">
          <LightBulbIcon className="w-5 h-5 text-yellow-500" />
          Tips Pengisan:
        </div>
          <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
            <li><strong>Nama Proyek:</strong> Gunakan nama yang deskriptif dan unik.</li>
            <li><strong>Engine:</strong> Sesuaikan dengan jenis database yang digunakan.</li>
            <li><strong>IP/Host:</strong> Gunakan <code>127.0.0.1</code> untuk lokal atau alamat server.</li>
            <li><strong>Port:</strong> Kosongkan untuk default (MySQL: 3306, PostgreSQL: 5432).</li>
            <li><strong>Username & Password:</strong> Gunakan user database yang memiliki akses ke schema.</li>
            <li><strong>Nama Database:</strong> Wajib diisi sesuai nama database yang ingin dikoneksikan.</li>
          </ul>
        </div>
      </div>

      {/* Tabel Hasil Koneksi */}
      {tables.length > 0 && (
        <div className="max-w-7xl mx-auto mt-10 space-y-4">
          <h2 className="text-lg font-semibold text-center">
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
                  className={`border rounded-xl shadow-sm p-4 ${
                    isSelected ? "border-blue-500 bg-blue-50" : "bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">📋 {tableName}</span>
                    <button
                      onClick={() => handleDescribeTable(tableName)}
                      className={`text-sm px-3 py-1 rounded ${
                        isSelected
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isLoading
                        ? "Loading..."
                        : isSelected
                        ? "Tutup"
                        : "Lihat Tabel"}
                    </button>
                  </div>

                  {isSelected && tableStructure.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border border-gray-200">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            {Object.keys(tableStructure[0]).map((key) => (
                              <th key={key} className="p-2 border-b">{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableStructure.map((col, i) => (
                            <tr key={i}>
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
    </div>
  );
}
