import { useState, useEffect } from 'react';
import { useApiStore } from '../store/useApiStore';
import { base_url } from '../store/useApiStore';
import axios from 'axios';
import { toast } from 'react-toastify';
import { PlusIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { LightBulbIcon} from '@heroicons/react/24/outline';
import 'react-toastify/dist/ReactToastify.css';

export default function AddDomainForm() {
  const [newDomain, setNewDomain] = useState('');
  const { domains, fetchDomains } = useApiStore();
  const [isVisible, setIsVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [tipsVisible, setTipsVisible] = useState(false);
  const [domainsVisible, setDomainsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger animations with staggered timing
    setTimeout(() => setIsVisible(true), 100);
    setTimeout(() => setFormVisible(true), 400);
    setTimeout(() => setTipsVisible(true), 600);
    setTimeout(() => setDomainsVisible(true), 800);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedDomain = newDomain.trim();

    if (!trimmedDomain) return toast.info("Domain tidak boleh kosong!");
    if (domains.includes(trimmedDomain)) return toast.warning("Domain sudah ada!");

    setIsSubmitting(true);
    try {
      await axios.post(`${base_url}/domain/post`, { url: trimmedDomain });
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Header */}
        <div 
          className="text-center"
          style={{
            transform: isVisible ? 'translateY(0)' : 'translateY(-30px)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
        >
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            Dokumentasi API
          </h1>
          <p 
            className="text-gray-500 text-sm"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
              opacity: isVisible ? 1 : 0,
              transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
            }}
          >
            Kelola dan tambahkan domain baru untuk API Anda
          </p>
        </div>

        {/* Form + Tips */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Form Card */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div 
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 flex flex-col gap-4"
              style={{
                transform: formVisible ? 'translateX(0) scale(1)' : 'translateX(-30px) scale(0.95)',
                opacity: formVisible ? 1 : 0,
                transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                ':hover': {
                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)'
                }
              }}
              onMouseEnter={(e) => {
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.target.style.transform = 'translateY(-2px)';
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
                <h2 className="text-lg font-semibold text-gray-800">Tambah Domain Baru</h2>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <label 
                  htmlFor="domainInput" 
                  className="block text-sm font-medium text-gray-700"
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(10px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s'
                  }}
                >
                  Masukkan Domain <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="domainInput"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="https://api.example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600 transition"
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(15px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.5s'
                  }}
                  onFocus={(e) => {
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.transition = 'transform 0.2s ease';
                  }}
                  onBlur={(e) => {
                    e.target.style.transform = 'scale(1)';
                  }}
                />
                <p 
                  className="text-xs text-gray-500"
                  style={{
                    transform: formVisible ? 'translateY(0)' : 'translateY(10px)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s'
                  }}
                >
                  Format: https://domain.com atau http://subdomain.domain.com
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    transform: formVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
                    opacity: formVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.7s'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.transition = 'transform 0.2s ease';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  <PlusIcon 
                    className="w-4 h-4" 
                    style={{
                      transform: isSubmitting ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  {isSubmitting ? 'Menambahkan...' : 'Tambah Domain'}
                </button>
              </form>
            </div>

            {/* Domains List */}
            {domains.length > 0 && (
              <div 
                className="bg-white shadow-sm rounded-lg p-6 border border-gray-200 flex flex-col gap-2"
                style={{
                  transform: domainsVisible ? 'translateY(0)' : 'translateY(30px)',
                  opacity: domainsVisible ? 1 : 0,
                  transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              >
                <div 
                  className="flex items-center mb-2"
                  style={{
                    transform: domainsVisible ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: domainsVisible ? 1 : 0,
                    transition: 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s'
                  }}
                >
                  <ClipboardDocumentListIcon 
                    className="w-5 h-5 text-gray-700 mr-2" 
                    style={{
                      transform: domainsVisible ? 'scale(1)' : 'scale(0.8)',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s'
                    }}
                  />
                  <h3 className="text-md font-semibold text-gray-800">
                    Domain Terdaftar ({domains.length})
                  </h3>
                </div>
                <div className="space-y-2">
                  {domains.map((domain, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-100 rounded-md"
                      style={{
                        transform: domainsVisible ? 'translateX(0)' : 'translateX(20px)',
                        opacity: domainsVisible ? 1 : 0,
                        transition: `all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${0.4 + index * 0.1}s`
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f3f4f6';
                        e.target.style.transform = 'translateX(5px)';
                        e.target.style.transition = 'all 0.2s ease';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#f9fafb';
                        e.target.style.transform = 'translateX(0)';
                      }}
                    >
                      <span className="text-sm text-gray-800 truncate">{domain}</span>
                      <span 
                        className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium"
                        style={{
                          animation: domainsVisible ? 'pulse 2s infinite' : 'none'
                        }}
                      >
                        Active
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tips Card */}
          <aside 
            className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm h-fit flex flex-col"
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
              className="flex items-center gap-2 font-semibold text-gray-700 mb-3"
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
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {[
                'Domain harus diawali dengan http:// atau https://',
                'Pastikan domain aktif dan dapat diakses',
                'Duplikasi domain akan otomatis ditolak',
                'Domain akan digunakan sebagai base URL endpoint'
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
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}