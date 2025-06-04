import { useEffect, useState, useRef, useCallback } from "react";
import { formatWaktu } from "../utils/waktu";
import {
  FiSend,
  FiMessageSquare,
  FiX,
  FiPaperclip,
  FiMaximize,
  FiMinimize,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { sendFileToTelegram } from "../api/guru/telegram";

export default function Chat({
  selectedUser,
  getMessagesWithUser,
  setSelectedUser,
  data,
  messagesEndRef,
  message,
  setMessage,
  handleSendMessage,
  isSending,
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) handleFile(file);
  };

  // Handle dropped files
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragOver(true);
    } else if (e.type === "dragleave") {
      setIsDragOver(false);
    }
  }, []);

  // Process selected file
  const handleFile = (file) => {
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      alert("Please select only image or video files");
      return;
    }

    setAttachment(file);
  };

  // Handle paste from clipboard
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;

      for (let i = 0; i < items.length; i++) {
        if (
          items[i].type.startsWith("image/") ||
          items[i].type.startsWith("video/")
        ) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            break;
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Remove attachment
  const removeAttachment = () => {
    setAttachment(null);
  };

  // Upload file and get URL
  const uploadFile = async (file) => {
    setIsUploading(true);
    try {
      const response = await sendFileToTelegram(file);
      return response; // Assuming the response contains the file URL
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  // Enhanced send message handler
  const enhancedSendMessage = async () => {
    try {
      if (!message.trim() || isSending || isUploading) return;

      let fileUrl = null;
      if (attachment) {
        fileUrl = await uploadFile(attachment);
      }



      handleSendMessage(fileUrl);

      // Clear after sending
      setMessage("");
      setAttachment(null);
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  // Handle preview click
  const handlePreviewClick = (msg) => {
    if (msg.file) {
      // || (msg.file.startsWith('data:image') ? 'image' : 'video'
      setPreviewItem({
        url: msg.file,
        type: msg.fileType,
      });
    }
  };

  // Close preview
  const closePreview = () => {
    setPreviewItem(null);
    setIsFullscreenPreview(false);
  };

  // Toggle fullscreen preview
  const toggleFullscreenPreview = () => {
    setIsFullscreenPreview(!isFullscreenPreview);
  };

  // Handle click outside preview
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        closePreview();
      }
    };

    if (previewItem) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [previewItem]);

  return (
    <>
      {/* Chat Modal */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setSelectedUser(null)}
          >
            <motion.div
              className="flex max-h-[80vh] w-full max-w-md flex-col rounded-lg bg-white shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              onDrop={handleDrop}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
            >
              <div className="flex items-center justify-between rounded-t-lg border-b bg-gray-50 p-4">
                <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto">
                {getMessagesWithUser(selectedUser.id).length > 0 ? (
                  <>
                    {getMessagesWithUser(selectedUser.id).map((msg, index) => (
                      <>
                        <div
                          key={index}
                          className={`flex ${msg.senderId === data.id ? "justify-end" : "justify-start"}`}
                        >
                          {msg.file && (
                            <div
                              className="mb-2 cursor-pointer"
                              onClick={() => handlePreviewClick(msg)}
                            >
                              {msg.file ? (
                                <img
                                  src={msg.file}
                                  alt="Attachment"
                                  className="max-h-40 rounded-md object-cover"
                                />
                              ) : (
                                <img
                                  src={msg.file}
                                  alt="Attachment"
                                  className="max-h-40 rounded-md object-cover"
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          key={index}
                          className={`flex ${msg.senderId === data.id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                              msg.senderId === data.id
                                ? "rounded-br-none bg-blue-500 text-white"
                                : "rounded-bl-none bg-gray-200 text-gray-800"
                            }`}
                          >
                            <p
                              style={{
                                whiteSpace: "pre-line",
                                position: "relative",
                              }}
                            >
                              {msg.message}
                            </p>
                            <p
                              className={`mt-1 text-xs ${msg.senderId === data.id ? "text-blue-100" : "text-gray-500"}`}
                            >
                              {formatWaktu(msg.timestamp)}
                            </p>
                          </div>
                        </div>
                      </>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    <FiMessageSquare className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-2">No messages yet</p>
                    <p className="text-sm">
                      Start a conversation with {selectedUser.name}
                    </p>
                  </div>
                )}

                {/* Attachment preview */}
                {attachment && (
                  <div className="mt-4">
                    <div className="relative">
                      {attachment.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(attachment)}
                          alt="Preview"
                          className="h-32 rounded-md object-cover"
                        />
                      ) : (
                        <video
                          src={URL.createObjectURL(attachment)}
                          controls
                          className="h-32 rounded-md object-cover"
                        />
                      )}
                      <button
                        onClick={removeAttachment}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
                      >
                        <FiX size={14} />
                      </button>
                      <div className="mt-1 text-xs text-gray-500">
                        {attachment.name} ({(attachment.size / 1024).toFixed(1)}{" "}
                        KB)
                      </div>
                    </div>
                  </div>
                )}

                {/* Drag overlay */}
                {isDragOver && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="rounded-lg bg-white p-6 text-center">
                      <FiPaperclip size={48} className="mx-auto mb-4" />
                      <p className="text-lg font-medium">Drop file to upload</p>
                      <p className="text-sm text-gray-500">
                        Supports single image or video
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-b-lg border-t bg-gray-50 p-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        type="text"
                        className="focus:outline-none w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={attachment ? 1 : 3}
                      />
                      <div className="absolute right-2 top-2 flex space-x-1">
                        <button
                          onClick={() => fileInputRef.current.click()}
                          className="rounded-full p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                          title="Attach file"
                        >
                          <FiPaperclip size={18} />
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*,video/*"
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="flex items-center justify-center rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
                    onClick={enhancedSendMessage}
                    disabled={
                      (!message.trim() && !attachment) ||
                      isSending ||
                      isUploading
                    }
                  >
                    {isSending || isUploading ? (
                      "Sending..."
                    ) : (
                      <>
                        <FiSend className="mr-1" /> Send
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-90 ${isFullscreenPreview ? "" : "p-4"}`}
          >
            <motion.div
              ref={previewRef}
              className={`relative ${isFullscreenPreview ? "h-screen w-screen" : "max-h-[90vh] max-w-4xl"}`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              {previewItem.file ? (
                <img
                  src={previewItem.url}
                  alt="Preview"
                  className={`${isFullscreenPreview ? "h-full w-full object-contain" : "max-h-[80vh] max-w-full rounded-md"}`}
                />
              ) : (
                <img
                  src={previewItem.url}
                  alt="Preview"
                  className={`${isFullscreenPreview ? "h-full w-full object-contain" : "max-h-[80vh] max-w-full rounded-md"}`}
                />
              )}

              <div className="absolute right-4 top-4 flex space-x-2">
                <button
                  onClick={toggleFullscreenPreview}
                  className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70"
                >
                  {isFullscreenPreview ? (
                    <FiMinimize size={20} />
                  ) : (
                    <FiMaximize size={20} />
                  )}
                </button>
                <button
                  onClick={closePreview}
                  className="rounded-full bg-black bg-opacity-50 p-2 text-white hover:bg-opacity-70"
                >
                  <FiX size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
