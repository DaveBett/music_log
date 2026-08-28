import { useEffect, useState } from "react";
import Avatar from "../Avatar";

export default function AvatarSettingsCard({
  user,
  onSave,
  saving
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
  };

  const handleSave = async () => {
    if (!file) {
      return;
    }

    await onSave(file);

    setFile(null);
    setPreview(null);
  };

  return (
    <section className="settings-card">
      <h2>Profile Picture</h2>
      <div className="avatar-settings">
        <Avatar
          src={preview || user?.avatar_url}
          username={user?.username}
          size={100}
        />

        <div className="avatar-settings-controls">

          <input
            id="avatar"
            className="input-avatar"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />

          <button
            className="auth-button"
            type="button"
            onClick={handleSave}
            disabled={!file || saving}
          >
            {saving ? "Saving..." : "Save avatar"}
          </button>

          <p className="img-type">
            JPEG, PNG or WebP. Maximum size: 5 MB.
          </p>
        </div>
      </div>
    </section>
  );
}