import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createWorkspace,
  updateWorkspace,
  getWorkspaceById,
} from "../../services/workspaceService";
import { uploadImages } from "../../services/uploadService";
import { generateDescription } from "../../services/aiService";
import { WORKSPACE_TYPES } from "../../utils/workspaceTypes";

const amenityKeys = [
  { key: "wifi", label: "Wifi" },
  { key: "meetingRoom", label: "Meeting room" },
  { key: "parking", label: "Parking" },
  { key: "ac", label: "AC" },
  { key: "cafeteria", label: "Cafeteria" },
  { key: "powerBackup", label: "Power backup" },
  { key: "cctv", label: "CCTV" },
  { key: "reception", label: "Reception" },
  { key: "printer", label: "Printer" },
  { key: "housekeeping", label: "Housekeeping" },
];

const WorkspaceForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "hotdesk",
    description: "",
    city: "",
    locality: "",
    address: "",
    price: "",
    seatsAvailable: "",
    areaSqft: "",
    floor: "",
    leaseTerm: "daily",
    amenities: {
      wifi: false,
      meetingRoom: false,
      parking: false,
      ac: false,
      cafeteria: false,
      powerBackup: false,
      cctv: false,
      reception: false,
      printer: false,
      housekeeping: false,
    },
    images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [aiKeywords, setAiKeywords] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchWorkspace = async () => {
        try {
          const data = await getWorkspaceById(id);
          setFormData({
            name: data.name,
            type: data.type || "hotdesk",
            description: data.description,
            city: data.city,
            locality: data.locality || "",
            address: data.address,
            price: data.price,
            seatsAvailable: data.seatsAvailable,
            areaSqft: data.areaSqft || "",
            floor: data.floor || "",
            leaseTerm: data.leaseTerm || "daily",
            amenities: data.amenities || {},
            images: data.images || [],
          });
        } catch (err) {
          setError(err.response?.data?.message || "Failed to load workspace");
        }
      };
      
      fetchWorkspace();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAmenityChange = (e) => {
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [e.target.name]: e.target.checked },
    });
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError("");
    setUploading(true);

    try {
      const urls = await uploadImages(files);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (urlToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((url) => url !== urlToRemove),
    }));
  };

  const handleGenerateDescription = async () => {
    if (!aiKeywords.trim()) {
      setAiError("Add a few keywords first (e.g. quiet, fast wifi, near metro)");
      return;
    }
    setAiError("");
    setAiGenerating(true);
    try {
      const description = await generateDescription({
        keywords: aiKeywords,
        name: formData.name,
        city: formData.city,
      });
      setFormData((prev) => ({ ...prev, description }));
    } catch (err) {
      setAiError(err.response?.data?.message || "Failed to generate description");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        seatsAvailable: Number(formData.seatsAvailable),
        areaSqft: formData.areaSqft ? Number(formData.areaSqft) : 0,
      };

      if (isEdit) {
        await updateWorkspace(id, payload);
      } else {
        await createWorkspace(payload);
      }

      navigate("/owner/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
          <span className="w-6 h-px bg-[#c9a26d]" />
          {isEdit ? "Editing" : "New listing"}
        </div>

        <h1
          className="text-3xl text-[#ede9e3] mb-8"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          {isEdit ? "Edit workspace" : "Add a workspace"}
        </h1>

        <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Space type */}
            <div>
              <label className="block text-sm text-[#948b80] mb-2">Space type</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {WORKSPACE_TYPES.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, type: t.key }))}
                    className={`px-3 py-2.5 rounded-lg border text-sm text-left transition ${
                      formData.type === t.key
                        ? "border-[#c9a26d] bg-[#c9a26d]/10 text-[#ede9e3]"
                        : "border-[#33302c] text-[#948b80] hover:border-[#33302c]/80"
                    }`}
                  >
                    <span className="mr-1">{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm text-[#948b80] mb-2">Photos</label>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {formData.images.map((url) => (
                    <div
                      key={url}
                      className="relative h-24 rounded-lg overflow-hidden border border-[#33302c] group"
                    >
                      <img
                        src={url}
                        alt="Workspace"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(url)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-[#12100f]/80 text-red-400 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-[#33302c] text-[#948b80] text-sm cursor-pointer hover:border-[#c9a26d]/50 hover:text-[#c9a26d] transition">
                {uploading ? "Uploading..." : "+ Upload photos"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {uploadError && (
                <p className="text-red-400 text-xs mt-2">{uploadError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
              />
            </div>

            {/* AI Description Generator */}
            <div className="bg-[#4c7a73]/5 border border-[#4c7a73]/20 rounded-lg p-4">
              <label className="block text-sm text-[#4c7a73] mb-2">
                ✨ Generate description with AI
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="quiet, fast wifi, near metro, natural light"
                  className="flex-1 px-3 py-2 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] text-sm focus:outline-none focus:border-[#4c7a73]"
                />
                <button
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={aiGenerating}
                  className="px-4 py-2 rounded-lg bg-[#4c7a73] text-[#ede9e3] text-sm hover:bg-[#5a8f87] transition disabled:opacity-50 whitespace-nowrap"
                >
                  {aiGenerating ? "Generating..." : "✨ Generate"}
                </button>
              </div>
              {aiError && <p className="text-red-400 text-xs mt-2">{aiError}</p>}
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#948b80] mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Locality / Area</label>
                <input
                  type="text"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="e.g. Vijay Nagar"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Full address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Billed</label>
                <select
                  name="leaseTerm"
                  value={formData.leaseTerm}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                >
                  <option value="hourly">Per hour</option>
                  <option value="daily">Per day</option>
                  <option value="monthly">Per month</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Seats</label>
                <input
                  type="number"
                  name="seatsAvailable"
                  value={formData.seatsAvailable}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Area (sq.ft)</label>
                <input
                  type="number"
                  name="areaSqft"
                  value={formData.areaSqft}
                  onChange={handleChange}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
              <div>
                <label className="block text-sm text-[#948b80] mb-1">Floor</label>
                <input
                  type="text"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  placeholder="e.g. 3rd Floor"
                  className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-2">Amenities</label>
              <div className="grid grid-cols-2 gap-2">
                {amenityKeys.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 text-[#ede9e3]/80 text-sm">
                    <input
                      type="checkbox"
                      name={key}
                      checked={formData.amenities[key] || false}
                      onChange={handleAmenityChange}
                      className="accent-[#c9a26d]"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-2.5 rounded-lg bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update workspace" : "Create workspace"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceForm;