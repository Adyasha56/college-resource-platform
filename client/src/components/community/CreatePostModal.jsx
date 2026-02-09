import { useState, useRef } from "react";
import { X, ImagePlus, Link2, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const postTypes = [
  { id: "discussion", label: "Discussion", description: "Start an open-ended discussion" },
  { id: "question", label: "Question", description: "Ask for help or clarification" },
  { id: "achievement", label: "Achievement", description: "Share your wins and milestones" },
  { id: "resource", label: "Resource", description: "Share useful links or tutorials" },
  { id: "project", label: "Project", description: "Showcase your project with images" },
];

const CreatePostModal = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState(1);
  const [type, setType] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    if (images.length + files.length > 5) {
      setError("Maximum 5 images allowed");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      files.forEach(file => formData.append("images", file));

      const res = await fetch(`${API_URL}/api/posts/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setImages(prev => [...prev, ...data.images]);
      } else {
        setError(data.message || "Upload failed");
      }
    } catch (err) {
      setError("Failed to upload images");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          type,
          title: title.trim(),
          content: content.trim(),
          link: link.trim() || undefined,
          images,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onPostCreated(data.post);
      } else {
        setError(data.message || "Failed to create post");
      }
    } catch (err) {
      setError("Failed to create post");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">
            {step === 1 ? "Choose Post Type" : "Create Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === 1 ? (
            // Step 1: Choose type
            <div className="space-y-2">
              {postTypes.map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => {
                    setType(pt.id);
                    setStep(2);
                  }}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:border-[#547792] hover:bg-[#ECEFCA] transition-all text-left"
                >
                  <span className="text-2xl">{pt.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pt.label}</h3>
                    <p className="text-sm text-gray-500">{pt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            // Step 2: Create post
            <div className="space-y-4">
              {/* Type Badge */}
              <button
                onClick={() => setStep(1)}
                className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                {postTypes.find(pt => pt.id === type)?.emoji} {postTypes.find(pt => pt.id === type)?.label} ← Change
              </button>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    type === "question"
                      ? "What's your question?"
                      : type === "achievement"
                      ? "What did you achieve?"
                      : "Give your post a title"
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, details, or context..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Link (for resource type) */}
              {(type === "resource" || type === "project") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link (optional)
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      placeholder="https://..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Images (for project type) */}
              {type === "project" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Images (optional, max 5)
                  </label>
                  
                  {/* Image Previews */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {images.map((img, i) => (
                        <div key={i} className="relative w-20 h-20">
                          <img
                            src={img.url}
                            alt={`Upload ${i + 1}`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(i)}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload Button */}
                  {images.length < 5 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-[#547792] hover:text-[#547792] transition-colors"
                    >
                      {uploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-5 h-5" />
                      )}
                      {uploading ? "Uploading..." : "Add Images"}
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 2 && (
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !content.trim()}
              className="px-6 py-2 bg-[#547792] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:bg-[#213448] transition-colors"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePostModal;
