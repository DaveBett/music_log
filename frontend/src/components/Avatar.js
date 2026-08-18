export default function Avatar({
  src,
  username,
  size = 40
}) {
  return (
    <div
      className="avatar"
      style={{
        width: size,
        height: size
      }}
    >
      {src ? (
        <img
          src={src}
          alt={username}
        />
      ) : (
        <span>
          {username?.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}