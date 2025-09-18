import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

export const base_url = import.meta.env.VITE_API_URL;

export const useApiStore = create((set, get) => ({
  endpoints: [],
  domains: [],
  restApis: [],
  // setStatusFilter,
  loadingEndpoints: false,
  loadingDomains: false,
  loadingRestApis: false,

  // setStatusFilter: (status) => set({ statusFilter: status }),

  getData: async (path, key, mapper, setLoadingKey) => {
    if (setLoadingKey) set({ [setLoadingKey]: true });
    try {
      const res = await axios.get(`${base_url}/${path}`);
      const data = typeof mapper === 'function' ? res.data.map(mapper) : res.data;
      set({ [key]: data });
    } catch (err) {
      console.error(`Gagal menampilkan data ${key}:`, err?.response?.data?.error || err.message);
      toast.error(`Gagal menampilkan data ${key}`);
    } finally {
      if (setLoadingKey) set({ [setLoadingKey]: false });
    }
  },

  deleteData: async (path, id, fetchFunc, setLoadingKey) => {
    if (setLoadingKey) set({ [setLoadingKey]: true });
    try {
      await axios.delete(`${base_url}/${path}/${id}`);
      if (typeof fetchFunc === 'function') await fetchFunc();
      toast.success('Data berhasil dihapus');
    } catch (err) {
      console.error(`Gagal hapus data ${path}:`, err?.response?.data?.error || err.message);
      toast.error(`Gagal hapus data`);
    } finally {
      if (setLoadingKey) set({ [setLoadingKey]: false });
    }
  },

  // ===================== ENDPOINTS =====================
  fetchEndpoints: async () => {
    await get().getData(
      'get',
      'endpoints',
      (ep) => ({
        ...ep,
        websites: typeof ep.websites === 'string'
          ? ep.websites.split(',').map((w) => w.trim())
          : ep.websites || [],
      }),
      'loadingEndpoints'
    );
  },

  addEndpoint: async (endpoint) => {
    try {
      const payload = {
        ...endpoint,
        websites: Array.isArray(endpoint.websites)
          ? endpoint.websites
          : typeof endpoint.websites === 'string'
          ? endpoint.websites.split(',').map((w) => w.trim())
          : [],
      };
      const res = await axios.post(`${base_url}/post`, payload);
      await get().fetchEndpoints();
      toast.success('Endpoint berhasil ditambahkan');
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Gagal menambahkan endpoint';
      toast.error(msg);
      console.error(msg);
      throw new Error(msg);
    }
  },

  updateEndpoint: async (id, updatedData) => {
    try {
      const payload = {
        ...updatedData,
        websites: Array.isArray(updatedData.websites)
          ? updatedData.websites
          : typeof updatedData.websites === 'string'
          ? updatedData.websites.split(',').map((w) => w.trim())
          : [],
      };
      await axios.put(`${base_url}/put/${id}`, payload);
      await get().fetchEndpoints();
      toast.success('Endpoint berhasil diupdate');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Gagal update endpoint';
      toast.error(msg);
      console.error(msg);
      throw new Error(msg);
    }
  },

  deleteEndpoint: async (id) => {
    await get().deleteData('delete', id, get().fetchEndpoints, 'loadingEndpoints');
  },

  generateResponseJson: async (tableName = 'endpoints') => {
    try {
      const res = await axios.get(`${base_url}/describe/${tableName}`);
      return res.data.success ? res.data.data : null;
    } catch (err) {
      console.error('Gagal generate response dari DB:', err.message);
      toast.error('Gagal generate response dari DB');
      return null;
    }
  },

  // ===================== PUBLIC API TEST =====================
  callPublicApi: async (endpoint) => {
    try {
      const baseUrl = endpoint.baseUrl?.replace(/\/+$/, '') || '';
      const path = endpoint.path?.replace(/^\/+/, '') || '';
      const url = `${baseUrl}/${path}`;

      const res = await axios({
        method: endpoint.method?.toLowerCase() || 'get',
        url,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        timeout: 10000
      });

      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const message = typeof data === 'string' ? data : JSON.stringify(data);

      console.error('Error testing endpoint:', message || err.message);

      return {
        error: true,
        status: status || 500,
        message: message || err.message || 'Unknown error'
      };
    }
  },

  callPublicApiByIdAndPath: async (id, path) => {
  try {
    const url = `http://localhost:5000/api/call/${id}/${path}`;
    const res = await axios.get(url, { timeout: 10000 });
    return res.data;
  } catch (err) {
    console.error('❌ Error call API:', err.message);
    return {
      error: true,
      message: err?.response?.data?.error || err.message,
      status: err?.response?.status || 500
    };
  }
},

generateSingleEndpointFromDb: async (uuid, table, path = `/${table}`) => {
  try {
    const res = await axios.post(`http://localhost:5000/api/restapi/generateone/${uuid}`, {
      table,
      path
    });

    toast.success(`Endpoint berhasil dibuat untuk tabel "${table}"`);

    await get().fetchEndpoints();

    return res.data;
  } catch (err) {
    const msg = err?.response?.data?.error || err.message || 'Gagal generate endpoint';
    toast.error(`Gagal generate: ${msg}`);
    console.error('DETAIL ERROR:', err?.response?.data || err);

    throw new Error(msg);
  }
},

  // ===================== DOMAINS =====================
  fetchDomains: async () => {
    await get().getData('domain/get', 'domains', (d) => d.url, 'loadingDomains');
  },

  addDomain: async (url) => {
    try {
      await axios.post(`${base_url}/domain/post`, { url });
      await get().fetchDomains();
      toast.success('Domain berhasil ditambahkan');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Gagal tambah domain';
      toast.error(msg);
      console.error(msg);
      throw new Error(msg);
    }
  },

  deleteDomain: async (id) => {
    await get().deleteData('domain/delete', id, get().fetchDomains, 'loadingDomains');
  },

  // ===================== REST APIs =====================
  fetchRestApis: async () => {
    await get().getData('restapi/get', 'restApis', null, 'loadingRestApis');
  },

  addRestApi: async (data) => {
    try {
      const payload = {
        projectName: typeof data.projectName === "string" ? data.projectName.trim() : "",
        engine: typeof data.engine === "string" ? data.engine.trim() : "",
        ip: typeof data.ip === "string" ? data.ip.trim() : "",
        port: data.port ? parseInt(data.port, 10) : undefined,
        username: typeof data.username === "string" ? data.username.trim() : "",
        password: typeof data.password === "string" ? data.password : "",
        database_name: typeof data.database_name === "string" ? data.database_name.trim() : "",
      };

      const res = await axios.post(`${base_url}/restapi/post`, payload);
      await get().fetchRestApis();
      toast.success('REST API berhasil ditambahkan');
      return res.data;
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Gagal menambahkan REST API';
      toast.error(msg);
      console.error(msg);
      throw new Error(msg);
    }
  },

  deleteRestApi: async (id) => {
    await get().deleteData('restapi/delete', id, get().fetchRestApis, 'loadingRestApis');
  },
}));
