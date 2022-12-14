import { useEffect, useRef, useState } from "react";
import Board from "./components/Board";
import Keyboard from "./components/Keyboard";
import NewWord from "./components/NewWord";
import { getWord } from "./services/words";
import "./styles.css";

const TRIES = 6;
const LETTERS = 5;

const getInitialTiles = () => {
  const tiles = new Array(TRIES);
  for (let i = 0; i < TRIES; i++) {
    tiles[i] = new Array(LETTERS).fill("");
  }
  return tiles;
};

const initalKeys = [
  { label: "q", type: "letter" },
  { label: "w", type: "letter" },
  { label: "e", type: "letter" },
  { label: "r", type: "letter" },
  { label: "t", type: "letter" },
  { label: "y", type: "letter" },
  { label: "u", type: "letter" },
  { label: "i", type: "letter" },
  { label: "o", type: "letter" },
  { label: "p", type: "letter" },
  { label: "", type: "filler", isDisabled: true },
  { label: "a", type: "letter" },
  { label: "s", type: "letter" },
  { label: "d", type: "letter" },
  { label: "f", type: "letter" },
  { label: "g", type: "letter" },
  { label: "h", type: "letter" },
  { label: "j", type: "letter" },
  { label: "k", type: "letter" },
  { label: "l", type: "letter" },
  { label: "", type: "filler", isDisabled: true },
  { label: "enter", type: "enter" },
  { label: "z", type: "letter" },
  { label: "x", type: "letter" },
  { label: "c", type: "letter" },
  { label: "v", type: "letter" },
  { label: "b", type: "letter" },
  { label: "n", type: "letter" },
  { label: "m", type: "letter" },
  { label: "clear", type: "clear" }
];

/*
 * Set state for keys with updated correctness for the keys position
 * absolute -> correct position for letter/key
 * relative -> letter/key present in current word but wrong position
 * none -> letter/key not present in current word
 */
const addCorrectnessStateForLetters = (indeces, setKeys, currentWord) => {
  setKeys((state) => {
    const stateCopy = JSON.parse(JSON.stringify(state));
    for (let i = 0; i < LETTERS; i++) {
      const index = indeces[i];
      if (!stateCopy[index]) return stateCopy;

      if (stateCopy[index].label === currentWord[i]) {
        stateCopy[index]["correctness"] = "absolute";
      } else {
        if (currentWord.includes(stateCopy[index].label)) {
          stateCopy[index]["correctness"] = "relative";
        } else {
          stateCopy[index]["correctness"] = "none";
        }
      }
      indeces[i] = { ...stateCopy[index] };
    }
    return stateCopy;
  });
};

/* Increments and decrements number of tries */
const handleTries = (triesDetails, action) => {
  const [row, col] = triesDetails;
  if (action === "increment") {
    return [row, col + 1];
  } else if (action === "decrement") {
    // Decrement only current row
    if (col < 0) {
      // Ensures the col does not go less than -1
      return [...triesDetails];
    } else {
      return [row, col - 1];
    }
  } else if (action === "next" && row < 5) {
    // Advancing to next row
    return [row + 1, -1];
  } else {
    return [row, col];
  }
};

/*
 * Adds the selected letters to tiles state
 * , checks the correctness of the added word and
 * makes a coy of the keys in the tiles state to maintain
 * correctness state of the letter for the row
 */
const handleTiles = ({
  tiles,
  tries,
  setKeys,
  setTiles,
  action,
  index,
  currentWord
}) => {
  const tilesCopy = JSON.parse(JSON.stringify(tiles));
  let [row, col] = tries.current;
  const currentRow = tilesCopy[row];
  if (action === "enter") {
    addCorrectnessStateForLetters(currentRow, setKeys, currentWord);
    [row, col] = handleTries([row, col], "next");
  } else if (action === "clear") {
    currentRow[col] = "";
    [row, col] = handleTries([row, col], "decrement");
  } else {
    [row, col] = handleTries([row, col], "increment");
    currentRow[col] = index;
  }
  tries.current = [row, col];
  setTiles(tilesCopy);
};

const allowRefresh = (tiles, tries) => {
  let [row, col] = tries.current;
  return typeof tiles[row][col] === "object";
};

export default function App() {
  const tries = useRef([0, -1]);
  const [currentWord, setCurrentWord] = useState("");
  const [keys, setKeys] = useState(JSON.parse(JSON.stringify(initalKeys)));
  const [tiles, setTiles] = useState(getInitialTiles());

  const handleKeyboardButton = (index) => {
    const [row] = tries.current;
    if (row >= TRIES) return;
    handleTiles({
      tries,
      keys,
      setKeys,
      tiles,
      setTiles,
      currentWord,
      action: keys[index].type,
      index: index
    });
  };

  const handleNewWord = () => {
    getWord().then((word) => setCurrentWord(word[0] || ""));
    setKeys(JSON.parse(JSON.stringify(initalKeys)));
    setTiles(getInitialTiles());
    tries.current = [0, -1];
  };

  useEffect(() => {
    handleNewWord();
  }, []);

  const isRefreshAllowed = allowRefresh(tiles, tries);
  return (
    <div className="App">
      <p
        onClick={handleNewWord}
        style={isRefreshAllowed ? { cursor: "pointer" } : {}}
      >
        {isRefreshAllowed ? "Refresh Wordle" : "Wordle"}
      </p>
      <Board tiles={tiles} keys={keys} tries={tries.current} />
      <Keyboard
        keys={keys}
        handleKeyboardButton={handleKeyboardButton}
        disableLetters={tries.current[1] === 4}
      />
    </div>
  );
}
