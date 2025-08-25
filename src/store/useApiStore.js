import { create } from 'zustand';
import axios from 'axios';

const base_url = 'http://localhost:5000/api';

export const useApiStore = create((set, get) => ({
  endpoints: [],
  domains: [],
  statusFilter: '',

  setStatusFilter: (status) => set({ statusFilter: status }),

  // ENDPOINTS

  fetchEndpoints: async () => {
    try {
      const res = await axios.get(`${base_url}/get`);

      const endpointsWithArrayWebsites = res.data.map(ep => ({
        ...ep,
        websites: typeof ep.websites === 'string'
          ? ep.websites.split(',').map(w => w.trim())
          : ep.websites || [],
      }));

      console.log('Endpoints dari server:', endpointsWithArrayWebsites);
      set({ endpoints: endpointsWithArrayWebsites });
    } catch (err) {
      console.error('Gagal fetch endpoints:', err.message);
    }
  },

  addEndpoint: async (endpoint) => {
    try {
      const res = await axios.post(`${base_url}/post`, endpoint);
      get().fetchEndpoints();
      return res.data;
    } catch (err) {
      console.error('Gagal menambahkan endpoint:', err.message);
    }
  },

  updateEndpoint: async (id, updatedData) => {
    try {
      await axios.put(`${base_url}/put/${id}`, updatedData);
      get().fetchEndpoints();
    } catch (err) {
      console.error('Gagal update endpoint:', err.message);
    }
  },

  deleteEndpoint: async (id) => {
    try {
      await axios.delete(`${base_url}/delete/${id}`);
      get().fetchEndpoints();
    } catch (err) {
      console.error('Gagal hapus endpoint:', err.message);
    }
  },

  // DOMAINS

  fetchDomains: async () => {
    try {
      const res = await axios.get(`${base_url}/domain/get`);
      set({ domains: res.data.map((d) => d.url) });
    } catch (err) {
      console.error('Gagal fetch domains:', err.message);
    }
  },

  addDomain: async (url) => {
    try {
      await axios.post(`${base_url}/domain/post`, { url });
      get().fetchDomains();
    } catch (err) {
      console.error('Gagal tambah domain:', err.message);
    }
  },
}));
