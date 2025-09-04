import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import '../style/EndpointList.css';

export default function EndpointList({ domainSearch = "" }) {
  const {
    endpoints,
    fetchEndpoints,
    deleteEndpoint,
    updateEndpoint,
    statusFilter,
  } = useApiStore();

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  const filtered = endpoints.filter((api) => {
    const statusMatch = !statusFilter || api.status === statusFilter;
    const domainMatch =
      !domainSearch || api.baseUrl.toLowerCase().includes(domainSearch.toLowerCase());
    return statusMatch && domainMatch;
  });

  const openModal = (type, endpoint) => {
    const formattedWebsites = Array.isArray(endpoint.websites)
      ? endpoint.websites
      : typeof endpoint.websites === "string"
      ? endpoint.websites.split(",").map((w) => w.trim())
      : [];

    setModalData({ ...endpoint, websites: formattedWebsites });
    setModalType(type);
    setShowModal(true);
  };

  const handleSaveEdit = async () => {
    if (!modalData.path || !modalData.description) {
      toast.info("Path dan Deskripsi tidak boleh kosong!");
      return;
    }

    try {
      await updateEndpoint(modalData.id, {
        baseUrl: modalData.baseUrl,
        method: modalData.method,
        path: modalData.path,
        description: modalData.description,
        status: modalData.status,
        websites: modalData.websites,
        response: modalData.response,
      });

      toast.success("Endpoint berhasil diubah");
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal mengubah endpoint");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEndpoint(modalData.id);
      toast.success("Endpoint berhasil dihapus");
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal menghapus endpoint");
    }
  };

  const getMethodClass = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "method-get";
      case "POST":
        return "method-post";
      case "PUT":
        return "method-put";
      case "DELETE":
        return "method-delete";
      default:
        return "method-default";
    }
  };

  const getStatusClass = (status) => {
    return status === 'Production' ? 'status-production' : 'status-develop';
  };

  return (
    <div className="endpoint-list-container">
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">Empty</div>
          <h3 className="empty-title">Tidak ada endpoint ditemukan</h3>
          <p className="empty-description">
            Coba ubah filter atau tambahkan endpoint baru
          </p>
        </div>
      ) : (
        <div className="endpoints-grid">
          {filtered.map((api, index) => (
            <div className="endpoint-card" key={api.id} style={{ animationDelay: `${index % 4}s` }}>
              <div className="endpoint-header">
                <div className="method-info">
                  <span className={`method-badge ${getMethodClass(api.method)}`}>
                    {api.method.toUpperCase()}
                  </span>
                  <div className="endpoint-path">
                    <h3 className="path-title">{api.path}</h3>
                    <span className={`status-badge ${getStatusClass(api.status)}`}>
                      {api.status}
                    </span>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <button 
                    className="action-btn view-btn" 
                    onClick={() => openModal("view", api)}
                    data-tooltip="View Details"
                  >
                    <i className="bi bi-eye"></i>
                  </button>
                  <button 
                    className="action-btn edit-btn" 
                    onClick={() => openModal("edit", api)}
                    data-tooltip="Edit"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    onClick={() => openModal("delete", api)}
                    data-tooltip="Delete"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
              <div className="endpoint-body">
                <div className="endpoint-info">
                  <div className="info-item">
                    <span className="info-label">Domain:</span>
                    <span className="info-value domain-value">{api.baseUrl}</span>
                  </div>
                  
                  <div className="info-item">
                    <span className="info-label">Description:</span>
                    <span className="info-value">{api.description}</span>
                  </div>

                  {api.websites?.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">Websites:</span>
                      <div className="websites-container">
                        {api.websites.map((website, i) => (
                          <span key={i} className="website-tag">
                            {website}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && modalData && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {modalType === "view" && "Detail Endpoint"}
                {modalType === "edit" && "Edit Endpoint"}
                {modalType === "delete" && "Hapus Endpoint"}
              </h2>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {modalType === "view" && (
                <div className="modal-view">
                  <div className="view-item">
                    <span className="view-label">Method:</span>
                    <div className="view-value-container">
                      <span className={`method-badge ${getMethodClass(modalData.method)}`}>
                        {modalData.method.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Path:</span>
                    <div className="view-value-container">
                      <span className="view-value">{modalData.path}</span>
                    </div>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Deskripsi:</span>
                    <div className="view-value-container">
                      <span className="view-value">{modalData.description}</span>
                    </div>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Status:</span>
                    <div className="view-value-container">
                      <span className={`status-badge ${getStatusClass(modalData.status)}`}>
                        {modalData.status}
                      </span>
                    </div>
                  </div>
                  <div className="view-item">
                    <span className="view-label">Domain:</span>
                    <div className="view-value-container">
                      <span className="view-value domain-value">{modalData.baseUrl}</span>
                    </div>
                  </div>
                  {modalData.websites?.length > 0 && (
                    <div className="view-item">
                      <span className="view-label">Websites:</span>
                      <div className="view-value-container">
                        <div className="websites-container">
                          {modalData.websites.map((w, i) => (
                            <span key={i} className="website-tag">{w}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="view-item response-item">
                    <span className="view-label">Response:</span>
                    <div className="view-value-container">
                      <pre className="response-preview">
                        {JSON.stringify(modalData.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {modalType === "edit" && (
                <div className="modal-edit">
                  <div className="edit-group">
                    <label className="edit-label">Path:</label>
                    <input
                      className="edit-input"
                      value={modalData.path}
                      onChange={(e) => setModalData({ ...modalData, path: e.target.value })}
                      placeholder="Path"
                    />
                  </div>
                  <div className="edit-group">
                    <label className="edit-label">Deskripsi:</label>
                    <textarea
                      className="edit-textarea"
                      rows={3}
                      value={modalData.description}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                      placeholder="Deskripsi"
                    />
                  </div>
                  <div className="edit-group">
                    <label className="edit-label">Websites:</label>
                    <input
                      className="edit-input"
                      value={modalData.websites.join(", ")}
                      onChange={(e) =>
                        setModalData({
                          ...modalData,
                          websites: e.target.value.split(",").map((w) => w.trim()),
                        })
                      }
                      placeholder="Websites (pisah koma)"
                    />
                  </div>
                </div>
              )}

              {modalType === "delete" && (
                <div className="modal-delete">
                  <div className="delete-icon">⚠</div>
                  <p className="delete-message">
                    Apakah Anda yakin ingin menghapus endpoint{" "}
                    <span className="delete-path">{modalData.path}</span>?
                  </p>
                  <p className="delete-warning">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button 
                className="modal-btn cancel-btn" 
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              {modalType === "edit" && (
                <button 
                  className="modal-btn save-btn" 
                  onClick={handleSaveEdit}
                >
                  Simpan
                </button>
              )}
              {modalType === "delete" && (
                <button 
                  className="modal-btn delete-confirm-btn" 
                  onClick={handleConfirmDelete}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}