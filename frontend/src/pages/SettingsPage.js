import { useState } from "react";
import { useAuth } from "../context/AuthContext";

import AccountSettingsCard from "../components/settings/AccountSettingsCard";
import SecuritySettingsCard from "../components/settings/SecuritySettingsCard";
import DangerZoneCard from "../components/settings/DangerZoneCard";

import { updatePassword } from "../api/endpoints";

import "./SettingsPage.css";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleProfileUpdate = async () => {
    setSavingProfile(true);
    setProfileError("");

    try {
      await updateProfile(username, email);

      console.log("handleUpdate called:", username);

      setProfileSuccess(true);

      setTimeout(() => {
        setProfileSuccess(false);
      }, 3000);

    } catch (err) {
      setProfileError(
        err.response?.data?.errors?.join(", ") ||
        "Unable to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setSavingPassword(true);
    setPasswordError("");

    try {
      await updatePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordSuccess(true);

      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);

    } catch (err) {
      setPasswordError(
        err.response?.data?.errors?.join(", ") ||
        err.response?.data?.error ||
        "Unable to update password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDelete = () => {
    alert("Delete account not implemented yet.");
  };

  return (
    <div className="settings-page">

      <h1>Settings</h1>

      <AccountSettingsCard
        username={username}
        email={email}
        setUsername={setUsername}
        setEmail={setEmail}
        onSave={handleProfileUpdate}
        saving={savingProfile}
      />

      {profileSuccess && (
        <div className="success-banner">
          Profile updated successfully.
        </div>
      )}

      {profileError && (
        <div className="error-banner">
          {profileError}
        </div>
      )}

      <SecuritySettingsCard
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        onSave={handlePasswordUpdate}
        saving={savingPassword}
      />

      {passwordSuccess && (
        <div className="success-banner">
          Password updated successfully.
        </div>
      )}

      {passwordError && (
        <div className="error-banner">
          {passwordError}
        </div>
      )}

      <DangerZoneCard
        onDelete={handleDelete}
      />

    </div>
  );
}