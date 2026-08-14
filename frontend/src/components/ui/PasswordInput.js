import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete = "current-password",
  required = false,
  className = "",
  children
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        id={id}
        className={`auth-input password-input ${className}`}
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
      />

      <button
        type="button"
        className="eye-button"
        onClick={() => setShowPassword((show) => !show)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
      {children && (
        <div className="password-input-footer">
          {children}
        </div>
      )}
    </div>
  );
}