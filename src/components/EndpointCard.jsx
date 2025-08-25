import { toast } from "react-toastify";

export default function EndpointCard({ api, index, onEdit, onDelete, onView }) {
  const getMethodColor = (method) => {
    switch (method.toUpperCase()) {
      case "GET":
        return "bg-success";
      case "POST":
        return "bg-primary";
      case "PUT":
        return "bg-warning text-dark";
      case "DELETE":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="mb-3">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row align-items-center">
            {/* Badge metode */}
            <div className="col-auto">
              <span className={`badge ${getMethodColor(api.method)} fs-6`}>
                {api.method.toUpperCase()}
              </span>
            </div>

            {/* Info endpoint */}
            <div className="col-md-6 ms-2">
              <h5 className="card-title mb-1">{api.path}</h5>
              <p className="card-text mb-1">
                <strong>Status:</strong> {api.status}
              </p>
              <p className="card-text mb-1">
                <strong>Domain:</strong> {api.baseUrl}
              </p>
              {api.websites && api.websites.length > 0 && (
                <p className="card-text mb-0">
                  <strong>Websites:</strong>{" "}
                  {api.websites.map((w, i) => (
                    <span key={i} className="badge bg-info text-dark me-1">
                      {w}
                    </span>
                  ))}
                </p>
              )}
            </div>

            {/* Tombol aksi */}
            <div className="col-md-4 text-md-end mt-2 mt-md-0">
              <button
                className="btn btn-primary btn-sm me-2"
                onClick={() => onView(index)}
                title="View"
              >
                <i className="bi bi-eye me-1"></i> View
              </button>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => onEdit(index)}
                title="Edit"
              >
                <i className="bi bi-pencil me-1"></i> Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => onDelete(index)}
                title="Delete"
              >
                <i className="bi bi-trash me-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
