import { X } from "lucide-react";

export default function QRModal({
  isOpen,
  onClose,
  title,
  description,
  qrUrl,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl p-10 w-[90%] max-w-sm relative shadow-xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
        <p className="text-center mb-6">{description}</p>

        <h2 className="text-xl font-bold text-center mb-4">Your QR Code</h2>

        {/* QR Image */}
        <div className="flex justify-center">
          <img
            src={qrUrl}
            alt="QR Code"
            className="w-48 h-48 border rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
