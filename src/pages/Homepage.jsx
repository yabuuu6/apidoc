import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import EndpointList from "../components/EndpointList";
import '../index.css';

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
    <div>
      
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        width: '100%', 
        minHeight: '100%' 
      }}>
        {/* Header */}
        <div style={{ 
          width: '100%', 
          textAlign: 'center', 
          paddingTop: '6rem', 
          paddingBottom: '3rem', 
          padding: '6rem 2rem 2rem 1rem' 
        }}>
          <h1>
            <i className="bi bi-journal-code" style={{ color: '#666666' }}></i>
            Dokumentasi API
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#666666',
            maxWidth: '32rem',
            margin: '0 auto',
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '2rem'
          }}>
            Kelola dan pantau semua endpoint API Anda dalam satu platform
          </p>
          
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 'bold',
            color: '#555555',
            marginBottom: '3rem'
          }}>
            Gunakan API Anda dengan Mudah dan Efisien
          </h2>
        </div>

{/* Filter Cards */}
<div className="w-full px-4 mb-12">
  <div className="grid gap-6 max-w-[1200px] mx-auto grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">

    {/* Domain Search Card */}
    <div
      className="relative bg-gray-50 border border-gray-200 rounded-xl p-8 shadow transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="text-2xl text-gray-500 mb-6">
        <i className="bi bi-search"></i>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Pencarian Domain
        <div className="h-[3px] w-12 rounded mt-2 bg-gray-300"></div>
      </h3>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Cari Domain API
      </p>

      <div className="relative">
        <i className="bi bi-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
        <input
          type="text"
          className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-md text-gray-800 text-base outline-none transition-all duration-300 focus:border-gray-600 focus:bg-white"
          placeholder="Contoh: api.example.com"
          value={domainSearch}
          onChange={(e) => setDomainSearch(e.target.value)}
        />
      </div>
    </div>

    {/* Status Filter Card */}
    <div
      className="relative bg-gray-50 border border-gray-200 rounded-xl p-8 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="text-2xl text-gray-500 mb-6">
        <i className="bi bi-toggle-on"></i>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-4">
        Status Environment
        <div className="h-[3px] w-12 rounded mt-2 bg-gray-300"></div>
      </h3>

      <p className="text-gray-600 mb-6 leading-relaxed">
        Filter Status Environment
      </p>

      <div className="relative">
        <i className="bi bi-funnel absolute left-4 top-1/2 transform -translate-y-1 text-gray-400 z-10 text-sm"></i>
        <select
           className="w-full pl-12 pr-10 py-3 bg-gray-100 border-2 border-gray-200 rounded-md text-gray-800 text-base outline-none transition-all duration-300 focus:border-gray-600 focus:bg-white cursor-pointer appearance-none bg-no-repeat bg-right-3 bg-[length:16px] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999999\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e')]"
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


        {/* Status Indicator */}
        <div style={{ 
          width: '100%', 
          padding: '0 1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#000000ff',
            border: '2px solid #ffffffff',
            borderRadius: '0.75rem',
            position: 'relative',
            overflow: 'hidden',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>

          </div>
        </div>

        {/* Endpoint List */}
        <div style={{ 
          width: '100%', 
          padding: '0 1rem 5rem 1rem' 
        }}>
          <div style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            <EndpointList domainSearch={domainSearch} />
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}