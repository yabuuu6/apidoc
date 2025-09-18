import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import EndpointList from "../components/EndpointList";
import '../index.css';
import { WrenchScrewdriverIcon } from '@heroicons/react/24/solid';
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";



export default function HomePage() {
  const {
    fetchEndpoints,
    fetchDomains,
  } = useApiStore();
  
  const [statusFilter, setStatusFilter] = useState("");
  const [pathSearch, setPathSearch] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  
  

  useEffect(() => {
    // setStatusFilter("");
    // setDomainSearch("");
    fetchEndpoints();
    fetchDomains();
    
    // Trigger animations
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setCardsVisible(true), 600);
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
          padding: '6rem 2rem 2rem 1rem',
          transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
          opacity: isVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }}>
          <h1 style={{
            transform: isVisible ? 'scale(1)' : 'scale(0.9)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
          }}>
            <i className="bi bi-journal-code" style={{ 
              color: '#666666',
              display: 'inline-block',
              transform: isVisible ? 'rotateY(0deg)' : 'rotateY(180deg)',
              transition: 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
            }}></i>
            Dokumentasi API
          </h1>
          
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#666666',
            maxWidth: '32rem',
            margin: '0 auto',
            fontWeight: '300',
            lineHeight: '1.6',
            marginBottom: '2rem',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
          }}>
            Kelola dan pantau semua endpoint API Anda dalam satu platform
          </p>
          
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 'bold',
            color: '#555555',
            marginBottom: '3rem',
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s'
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
            style={{
              transform: cardsVisible ? 'translateX(0)' : 'translateX(-50px)',
              opacity: cardsVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <div className="text-2xl text-gray-500 mb-6" style={{
              transform: cardsVisible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(-180deg)',
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
            }}>
              <i className="bi bi-search"></i>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
  transform: cardsVisible ? 'translateY(0)' : 'translateY(10px)',
  opacity: cardsVisible ? 1 : 0,
  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
}}>
  Pencarian Path
  <div className="h-[3px] w-12 rounded mt-2 bg-gray-300" style={{
    width: cardsVisible ? '3rem' : '0',
    transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
  }}></div>
</h3>

<p className="text-gray-600 mb-6 leading-relaxed" style={{
  transform: cardsVisible ? 'translateY(0)' : 'translateY(10px)',
  opacity: cardsVisible ? 1 : 0,
  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
}}>
  Cari Path Endpoint API
</p>

<div className="relative" style={{
  transform: cardsVisible ? 'translateY(0)' : 'translateY(15px)',
  opacity: cardsVisible ? 1 : 0,
  transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
}}>
  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
    <MagnifyingGlassIcon className="w-4 h-4" />
  </div>
  <input
    type="text"
    className="w-full pl-12 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-md text-gray-800 text-base outline-none transition-all duration-300 focus:border-gray-600 focus:bg-white"
    placeholder="Contoh: /users atau /products"
    value={pathSearch}
    onChange={(e) => setPathSearch(e.target.value)}
    style={{
      transition: 'all 0.3s ease, transform 0.2s ease'
    }}
    onFocus={(e) => e.target.style.transform = 'scale(1.02)'}
    onBlur={(e) => e.target.style.transform = 'scale(1)'}
  />
</div>

          </div>

          {/* Status Filter Card */}
          <div
            className="relative bg-gray-50 border border-gray-200 rounded-xl p-8 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{
              transform: cardsVisible ? 'translateX(0)' : 'translateX(50px)',
              opacity: cardsVisible ? 1 : 0,
              transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
            }}
          >
            <div className="text-2xl text-gray-500 mb-6" style={{
              transform: cardsVisible ? 'scale(1) rotate(0deg)' : 'scale(0.5) rotate(180deg)',
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
            }}>
              <i className="bi bi-toggle-on"></i>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4" style={{
              transform: cardsVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: cardsVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
            }}>
              Status Environment
              <div className="h-[3px] w-12 rounded mt-2 bg-gray-300" style={{
                width: cardsVisible ? '3rem' : '0',
                transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s'
              }}></div>
            </h3>

            <p className="text-gray-600 mb-6 leading-relaxed" style={{
              transform: cardsVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: cardsVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s'
            }}>
              Filter Status Environment
            </p>

            <div className="relative" style={{
              transform: cardsVisible ? 'translateY(0)' : 'translateY(15px)',
              opacity: cardsVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s'
            }}>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
                <WrenchScrewdriverIcon className="w-4 h-4" />
              </div>
              <select
                className="w-full pl-12 pr-10 py-3 bg-gray-100 border-2 border-gray-200 rounded-md text-gray-800 text-base outline-none transition-all duration-300 focus:border-gray-600 focus:bg-white cursor-pointer appearance-none bg-no-repeat bg-right-3 bg-[length:16px] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23999999\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'/%3e%3c/svg%3e')]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{
                  transition: 'all 0.3s ease, transform 0.2s ease'
                }}
                onFocus={(e) => e.target.style.transform = 'scale(1.02)'}
                onBlur={(e) => e.target.style.transform = 'scale(1)'}
              >
                <option value="">Semua</option>
                <option value="Develop">Develop</option>
                <option value="Production">Production</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Status Indicator / Daftar REST API Label */}
      <div className="w-full px-4 mb-6" style={{
        transform: cardsVisible ? 'translateY(0)' : 'translateY(20px)',
        opacity: cardsVisible ? 1 : 0,
        transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s'
      }}>
        <h2 className="text-xl font-bold text-gray-700 max-w-[1200px] mx-auto">
          Daftar REST API :
        </h2>
      </div>

        {/* Endpoint List */}
        <div style={{ 
          width: '100%', 
          padding: '0 1rem 5rem 1rem',
          transform: cardsVisible ? 'translateY(0)' : 'translateY(30px)',
          opacity: cardsVisible ? 1 : 0,
          transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1s'
        }}>
          <div style={{
            backgroundColor: '#f9f9f9',
            border: '1px solid #e5e5e5',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 4px 15px rgba(221, 92, 92, 0.1)',
            maxWidth: '1200px',
            margin: '0 auto',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 8px 25px rgba(221, 92, 92, 0.15)';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = '0 4px 15px rgba(221, 92, 92, 0.1)';
            e.target.style.transform = 'translateY(0)';
          }}>
            <EndpointList pathSearch={pathSearch} statusFilter={statusFilter} />

          </div>
        </div>
      </div>
    </div>
  );
}