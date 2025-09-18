import { useEffect, useState } from "react";
import { useApiStore } from "../store/useApiStore";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { EyeIcon, PencilSquareIcon, TrashIcon, ClipboardIcon } from "@heroicons/react/24/outline";

export default function EndpointList({ pathSearch = "", statusFilter = "" }) {
  const {
    endpoints,
    fetchEndpoints,
    deleteEndpoint,
    updateEndpoint,
  } = useApiStore();

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    fetchEndpoints();
  }, [fetchEndpoints]);

  // const filtered = endpoints.filter((api) => {
  //   const statusMatch = !statusFilter || api.status === api.statusFilter;
  //   const domainMatch =
  //     !domainSearch || api.baseUrl.toLowerCase().includes(domainSearch.toLowerCase());
  //   return statusMatch && domainMatch;
  // });
  const filtered = endpoints.filter((api) => {
  const matchesStatus = statusFilter ? api.status === statusFilter : true;
  const matchesPath = pathSearch ? api.path.includes(pathSearch) : true;
  return matchesStatus && matchesPath;
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
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal mengubah endpoint");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteEndpoint(modalData.id);
      setShowModal(false);
    } catch (err) {
      toast.error("Gagal menghapus endpoint");
    }
  };

  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" };
      case "POST":
        return { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-500" };
      case "PUT":
        return { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-500" };
      case "DELETE":
        return { bg: "bg-red-100", text: "text-red-800", border: "border-red-500" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-400" };
    }
  };

  const getStatusColor = (status) => {
    return status === "Production"
      ? { bg: "bg-green-100", text: "text-green-800", border: "border-green-500" }
      : { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-500" };
  };

  return (
    <div className="w-full">
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <div className="text-6xl mb-4 text-gray-300">📄</div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Tidak ada endpoint ditemukan
          </h3>
          <p className="text-sm text-gray-500">
            Coba ubah filter atau tambahkan endpoint baru
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(350px,1fr))]">
          {filtered.map((api) => {
            const publicUrl = `http://localhost:5000/api/call/${api.id}${api.path}`;
            return (
              <div
                key={api.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div
                        className={`inline-block ${getMethodColor(api.method).bg} ${getMethodColor(
                          api.method
                        ).text} ${getMethodColor(api.method).border} border px-3 py-1 rounded-md font-bold text-xs mb-3`}
                      >
                        {api.method.toUpperCase()}
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-gray-800 break-words">{api.path}</h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(
                            api.status
                          ).bg} ${getStatusColor(api.status).text} ${getStatusColor(api.status).border} border`}
                        >
                          {api.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => openModal("view", api)}
                        className="p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 flex items-center justify-center"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("edit", api)}
                        className="p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-all duration-200 flex items-center justify-center"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => openModal("delete", api)}
                        className="p-2 bg-gray-100 border border-gray-200 rounded-md text-gray-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200 flex items-center justify-center"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-600">Domain:</span>
                      <span className="text-sm text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded max-w-full truncate block">
                        {api.baseUrl}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-gray-600">URL Publik:</span>
                      <a
                        href={publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all font-mono text-sm"
                      >
                        {publicUrl}
                      </a>
                    </div>

                    <div className="flex items-start gap-2">
                      <span className="text-sm font-semibold text-gray-600">Description:</span>
                      <span className="text-sm text-gray-700">{api.description}</span>
                    </div>

                    {api.websites?.length > 0 && (
                      <div>
                        <span className="text-sm font-semibold text-gray-600">Websites:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {api.websites.map((w, i) => (
                            <span
                              key={i}
                              className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-0.5 rounded"
                            >
                              {w}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tombol Copy URL */}
                <div className="mt-4">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(publicUrl);
                      toast.success("URL disalin ke clipboard");
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300 rounded-md px-4 py-2 flex items-center justify-center gap-2 transition"
                  >
                    <ClipboardIcon className="w-5 h-5" />
                    Salin URL Publik
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {showModal && modalData && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-auto border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 m-0">
                {modalType === "view" && "Detail Endpoint"}
                {modalType === "edit" && "Edit Endpoint"}
                {modalType === "delete" && "Hapus Endpoint"}
              </h2>
              <button
                className="bg-transparent border-none text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* VIEW */}
              {modalType === "view" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Method:</span>
                    <div className="mt-1">
                      <span
                        className={`px-3 py-1 rounded-md font-bold text-sm ${getMethodColor(
                          modalData.method
                        ).bg} ${getMethodColor(modalData.method).text} ${getMethodColor(
                          modalData.method
                        ).border} border`}
                      >
                        {modalData.method.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Path:</span>
                    <div className="mt-1 text-gray-800 break-all">{modalData.path}</div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Deskripsi:</span>
                    <div className="mt-1 text-gray-800 break-words">{modalData.description}</div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Status:</span>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(
                          modalData.status
                        ).bg} ${getStatusColor(modalData.status).text} ${getStatusColor(
                          modalData.status
                        ).border} border`}
                      >
                        {modalData.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Domain:</span>
                    <div className="mt-1 font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 truncate">
                      {modalData.baseUrl}
                    </div>
                  </div>

                  {modalData.websites?.length > 0 && (
                    <div>
                      <span className="text-sm font-semibold text-gray-600">Websites:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {modalData.websites.map((w, i) => (
                          <span
                            key={i}
                            className="bg-blue-100 text-blue-800 border border-blue-200 text-xs px-2 py-0.5 rounded"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-sm font-semibold text-gray-600">Response:</span>
                    <pre className="bg-gray-100 p-4 rounded border border-gray-200 text-xs font-mono text-gray-800 max-h-72 overflow-auto whitespace-pre-wrap mt-1">
                      {JSON.stringify(modalData.response, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* EDIT */}
              {modalType === "edit" && (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600">Path:</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                      value={modalData.path}
                      onChange={(e) => setModalData({ ...modalData, path: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Deskripsi:</label>
                    <textarea
                      className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                      value={modalData.description}
                      onChange={(e) => setModalData({ ...modalData, description: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-600">Status:</label>
                    <select
                      className="w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:border-gray-600"
                      value={modalData.status}
                      onChange={(e) => setModalData({ ...modalData, status: e.target.value })}
                    >
                      <option value="Develop">Develop</option>
                      <option value="Production">Production</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <button
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded"
                      onClick={handleSaveEdit}
                    >
                      Simpan
                    </button>
                  </div>
                </div>
              )}

              {/* DELETE */}
              {modalType === "delete" && (
                <div className="flex flex-col gap-6">
                  <p className="text-gray-700 text-sm">
                    Apakah kamu yakin ingin menghapus endpoint{" "}
                    <span className="font-semibold text-red-600">{modalData.path}</span>? Tindakan ini tidak bisa dibatalkan.
                  </p>
                  <div className="flex justify-end gap-2">
                    <button
                      className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded"
                      onClick={() => setShowModal(false)}
                    >
                      Batal
                    </button>
                    <button
                      className="bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded"
                      onClick={handleConfirmDelete}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
