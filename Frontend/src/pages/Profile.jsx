import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../context/useAuth";
import { updateProfile, getMyStats } from "../services/authService";
import { uploadImages } from "../services/uploadService";

const Profile = () => {
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({ bookingsCount: 0, wishlistCount: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMyStats();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setStatsLoading(false);
      }
    };
   
    fetchStats();
  }, []);

  const handleAvatarUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const urls = await uploadImages(files);
      setAvatar(urls[0]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const payload = { name, avatar };
      if (password) payload.password = password;

      const updatedUser = await updateProfile(payload);
      login(updatedUser);
      toast.success("Profile updated");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update profile";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#12100f] px-6 sm:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-xs text-[#948b80] uppercase tracking-widest">
            <span className="w-6 h-px bg-[#c9a26d]" />
            Account
          </div>
          <h1
            className="text-3xl text-[#ede9e3] mb-8"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            My Profile
          </h1>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5">
            <div
              className="text-2xl text-[#c9a26d]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {statsLoading ? "—" : stats.bookingsCount}
            </div>
            <div className="text-xs text-[#948b80] uppercase tracking-wide mt-1">
              Bookings made
            </div>
          </div>
          <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-5">
            <div
              className="text-2xl text-[#c9a26d]"
              style={{ fontFamily: "'IBM Plex Mono', monospace" }}
            >
              {statsLoading ? "—" : stats.wishlistCount}
            </div>
            <div className="text-xs text-[#948b80] uppercase tracking-wide mt-1">
              Saved workspaces
            </div>
          </div>
        </div>

        <div className="bg-[#1c1917] border border-[#33302c] rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm border border-red-500/20">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#262220] border border-[#33302c] flex items-center justify-center shrink-0">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span
                    className="text-xl text-[#c9a26d]"
                    style={{ fontFamily: "'Fraunces', serif" }}
                  >
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              <label className="px-4 py-2 rounded-lg border border-[#33302c] text-[#948b80] text-sm cursor-pointer hover:border-[#c9a26d]/50 hover:text-[#c9a26d] transition">
                {uploading ? "Uploading..." : "Change photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Full name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
              />
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Email</label>
              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f]/50 border border-[#33302c] text-[#948b80] cursor-not-allowed"
              />
              <p className="text-[#66605a] text-xs mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm text-[#948b80] mb-1">Role</label>
              <input
                type="text"
                value={user.role}
                disabled
                className="w-full px-4 py-2.5 rounded-lg bg-[#12100f]/50 border border-[#33302c] text-[#948b80] cursor-not-allowed capitalize"
              />
            </div>

            <div className="pt-4 border-t border-[#33302c]">
              <p className="text-sm text-[#948b80] mb-4">Change password (optional)</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#948b80] mb-1">New password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    placeholder="Leave blank to keep same"
                    className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#948b80] mb-1">Confirm password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    className="w-full px-4 py-2.5 rounded-lg bg-[#12100f] border border-[#33302c] text-[#ede9e3] focus:outline-none focus:border-[#c9a26d] transition"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-lg bg-[#c9a26d] text-[#12100f] font-medium hover:bg-[#d9b481] transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </motion.button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;