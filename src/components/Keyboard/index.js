import Button from "./Button";

export default function Keyboard(props) {
  const { keys, disableLetters, handleKeyboardButton } = props;

  return (
    <div className="keyboard">
      {keys.map((key, index) => (
        <Button
          key={index}
          {...key}
          handleButton={() => handleKeyboardButton(index)}
          disableLetters={disableLetters}
        />
      ))}
    </div>
  );
}
