export default function NewWord(props) {
  const { handleNewWord } = props;
  return (
    <div onClick={handleNewWord} className="new-word">
      new word
    </div>
  );
}
