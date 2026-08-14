import Card from "../ui/Card";

export default function AccountSettingsCard({
  username,
  email,
  setUsername,
  setEmail,
  onSave,
  saving,
}) {
  return (
    <Card
      title="Account"
      subtitle="Update your username and email."
      footer={
        <button
          className="auth-button"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      }
    >
      <label>
        Username
        <input
          className="auth-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          className="auth-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
    </Card>
  );
}