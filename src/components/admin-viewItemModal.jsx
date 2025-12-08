import { X, Package, CheckCircle2, Check, Award } from "lucide-react";
import { ClipLoader } from "react-spinners";

const ItemDetailModal = ({
  item,
  onClose,
  mode, // 'approved' or 'reported'
  // For approved mode
  onReunited,
  onDelete,
  reunitingId,
  deletingId,
  setDeleteConfirm,
  // For reported mode
  onApprove,
  onReject,
  actionLoading,
}) => {
  if (!item) return null;

  // Made this way kay ang vercel pango pango e convert ug UCT ang original time so di nalang mo gamit ug Date()
  // Brute force baby
  const dateOnlyRaw = item.date_time_found.split(" ")[0];
  const timeOnly = item.date_time_found.split(" ")[1];

  const [year, month, day] = dateOnlyRaw.split("-");
  const dateOnly = new Date(year, month - 1, day).toLocaleDateString("en-PH", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const getItemStatus = (item) => {
    if (item.reunited || item.admin_approved) return "reunited";
    if (item.founder_confirmed && item.claimer_confirmed) return "confirmed";
    if (item.status === "claimed") return "pending";
    return "available";
  };

  const StatusBadge = ({ status }) => {
    const configs = {
      available: {
        bg: "bg-green-100",
        text: "text-green-700",
        label: "Available",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        label: "Pending Claim",
      },
      confirmed: {
        bg: "bg-blue-100",
        text: "text-blue-700",
        label: "Both Confirmed",
      },
      reunited: {
        bg: "bg-purple-100",
        text: "text-purple-700",
        label: "Reunited",
      },
    };
    const config = configs[status] || configs.available;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 ${config.bg} ${config.text} text-xs font-bold rounded-full`}
      >
        {status === "reunited" && <Award className="w-3 h-3" />}
        {config.label}
      </span>
    );
  };

  const itemStatus = mode === "approved" ? getItemStatus(item) : null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Item Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.description}
              className="w-full h-64 object-cover rounded-lg mb-4"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
          ) : null}
          <div
            className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center"
            style={{ display: item.image_url ? "none" : "flex" }}
          >
            <Package className="w-20 h-20 text-gray-400" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Category
                </label>
                <p className="text-lg text-gray-800 mt-1">
                  {item.category || "N/A"}
                </p>
              </div>
              {mode === "approved" && <StatusBadge status={itemStatus} />}
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Description
              </label>
              <p className="text-lg text-gray-800 mt-1">{item.description}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Location {mode === "approved" ? "Found" : ""}
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {item.location_description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Date Found
                </label>
                <p className="text-lg text-gray-800 mt-1">{dateOnly}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Time Found
                </label>
                <p className="text-lg text-gray-800 mt-1">{timeOnly}</p>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Reported By
              </label>
              <p className="text-lg text-gray-800 mt-1">{item.full_name}</p>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                Reported On
              </label>
              <p className="text-lg text-gray-800 mt-1">
                {mode === "approved"
                  ? `${dateOnly}, ${timeOnly}`
                  : new Date(item.created_at).toLocaleString()}
              </p>
            </div>

            {/* Claim Status - Only for approved mode */}
            {mode === "approved" &&
              (item.founder_confirmed || item.claimer_confirmed) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Claim Confirmation Status
                  </h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.founder_confirmed
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />
                      <span>
                        Founder Confirmed:{" "}
                        {item.founder_confirmed ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          item.claimer_confirmed
                            ? "text-green-600"
                            : "text-gray-300"
                        }`}
                      />
                      <span>
                        Claimer Confirmed:{" "}
                        {item.claimer_confirmed ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>

          {/* Actions - Different for each mode */}
          <div className="flex gap-3 mt-6 pt-6 border-t">
            {mode === "approved" ? (
              <>
                {!item.reunited &&
                  item.founder_confirmed &&
                  item.claimer_confirmed && (
                    <button
                      onClick={() => onReunited(item.found_item_id)}
                      disabled={reunitingId === item.found_item_id}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reunitingId === item.found_item_id ? (
                        <ClipLoader size={20} color="#fff" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          Mark as Reunited
                        </>
                      )}
                    </button>
                  )}
                <button
                  onClick={() => setDeleteConfirm(item.found_item_id)}
                  disabled={deletingId === item.found_item_id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === item.found_item_id ? (
                    <ClipLoader size={20} color="#fff" />
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Delete Item
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onApprove(item.found_item_id)}
                  disabled={actionLoading === item.found_item_id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === item.found_item_id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
                <button
                  onClick={() => onReject(item.found_item_id)}
                  disabled={actionLoading === item.found_item_id}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === item.found_item_id ? (
                    <ClipLoader color="#ffffff" size={20} />
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Reject
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailModal;
