import Card from "../ui/Card";
import PasswordInput from "../ui/PasswordInput";

export default function SecuritySettingsCard({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSave,
  saving,
}) {
  return (
    <Card
      title="Security"
      subtitle="Update your password."
      footer={
        <button
          className="auth-button"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
      }
    >
      <PasswordInput
        id="current-password"
        placeholder="Current password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        autoComplete="current-password"
      />

      <PasswordInput
        id="new-password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        autoComplete="new-password"
      />

      <PasswordInput
        id="confirm-password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        autoComplete="new-password"
      />
    </Card>
  );
}