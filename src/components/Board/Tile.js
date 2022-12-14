export default function Tile(props) {
  const { label, correctness } = props;
  return (
    <div className={`tile ${correctness} ${label ? "letter" : ""}`}>
      {label}
    </div>
  );
}
