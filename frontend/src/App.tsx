type Props = {
  title: string;
  description: string;
  example: string;
};

export default function LessonCard({ title, description, example }: Props) {
  return (
    <div style={cardStyle}>
      <h2 style={{ margin: "0 0 8px 0" }}>{title}</h2>
      <p style={{ margin: "0 0 8px 0" }}>{description}</p>
      <p style={{ margin: "0", fontWeight: "bold" }}>Example: {example}</p>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  width: "250px",
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px",
  backgroundColor: "#fff",
};
