export default function Button(props) {
  const {
    label,
    type,
    isDisabled,
    disableLetters,
    correctness,
    handleButton
  } = props;
  const isLetterDisabled = type === "letter" && disableLetters;
  return (
    <button
      onClick={handleButton}
      className={`${type} ${correctness}`}
      disabled={isDisabled || isLetterDisabled}
    >
      {label}
    </button>
  );
}
