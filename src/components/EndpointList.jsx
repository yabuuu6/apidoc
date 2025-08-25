import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import EndpointCard from "./EndpointCard";
import { toast } from "react-toastify";

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
      response: modalData.response
    });

      toast.success("Endpoint berhasil diubah", { icon: "✏️" });
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal mengubah endpoint");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEndpoint(modalData.id);
      toast.success("Endpoint berhasil dihapus", { icon: "🗑️" });
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal menghapus endpoint");
    }
  };

  return (
    <div className="mt-3">
      {filtered.length === 0 ? (
        <div className="alert alert-warning text-center">
          Tidak ada endpoint ditemukan.
        </div>
      ) : (
        filtered.map((api, index) => (
          <EndpointCard
            key={api.id}
            index={index}
            api={api}
            onView={() => openModal("view", api)}
            onEdit={() => openModal("edit", api)}
            onDelete={() => openModal("delete", api)}
          />
        ))
      )}

      {/* MODAL */}
      {showModal && modalData && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalType === "view" && "Detail Endpoint"}
                  {modalType === "edit" && "Edit Endpoint"}
                  {modalType === "delete" && "Hapus Endpoint"}
                </h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <div className="modal-body">
                {modalType === "view" && (
                  <div className="d-flex flex-column gap-2">
                    <div><strong>Path:</strong> {modalData.path}</div>
                    <div><strong>Deskripsi:</strong> {modalData.description}</div>
                    <div><strong>Status:</strong> {modalData.status}</div>
                    <div><strong>Domain:</strong> {modalData.baseUrl}</div>
                    {modalData.websites?.length > 0 && (
                      <div>
                        <strong>Websites:</strong>{" "}
                        {modalData.websites.map((w, i) => (
                          <span key={i} className="badge bg-info text-dark me-1">{w}</span>
                        ))}
                      </div>
                    )}
                    <div>
                      <strong>Response:</strong>
                      <pre className="bg-light p-2 rounded">
                        {JSON.stringify(modalData.response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {modalType === "edit" && (
                  <div className="d-flex flex-column gap-2">
                    <input
                      className="form-control"
                      value={modalData.path}
                      onChange={(e) => setModalData({ ...modalData, path: e.target.value })}
                      placeholder="Path"
                    />
                    <textarea
                      className="form-control"
                      rows={2}
                      value={modalData.description}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                      placeholder="Deskripsi"
                    />
                    <input
                      className="form-control"
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
                )}

                {modalType === "delete" && (
                  <p>Apakah Anda yakin ingin menghapus endpoint <strong>{modalData.path}</strong>?</p>
                )}
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                {modalType === "edit" && (
                  <button className="btn btn-primary" onClick={handleSaveEdit}>Simpan</button>
                )}
                {modalType === "delete" && (
                  <button className="btn btn-danger" onClick={handleConfirmDelete}>Hapus</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
