import React, { useState, useEffect } from "react";
import { CheckCircle, Copy, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const SuccessModal = ({ isOpen, onClose, successMessage, eventId }) => {
  const [isCopied, setIsCopied] = useState(false);
  const shareableLink = `https://easy-fest.onrender.com/event/${eventId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        {/* Success icon and message */}
        <div className="flex flex-col items-center text-center space-y-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
          <h3 className="text-xl font-semibold text-gray-900">
            {successMessage}
          </h3>

          {/* Shareable link section */}
          <div className="w-full mt-4">
            <p className="text-sm text-gray-600 mb-2">Shareable event link:</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-gray-100 rounded text-sm truncate">
                {shareableLink}
              </div>
              <Button
                size="sm"
                onClick={handleCopyLink}
                className="flex items-center gap-1"
              >
                <Copy size={16} />
                {isCopied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>

          {/* Close button */}
          <Button onClick={onClose} className="mt-6">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
