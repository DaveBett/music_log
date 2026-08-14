import Card from "../ui/Card";

export default function DangerZoneCard({ onDelete }) {
  return (
    <Card title="Danger Zone" subtitle="Deleting your account is permanent and cannot be undone.">
      <button className="cancel-button" onClick={onDelete}>
        Delete Account
      </button>
    </Card>
  );
}