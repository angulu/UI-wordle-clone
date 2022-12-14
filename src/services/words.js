export async function getWord() {
  const word = await fetch(
    "https://random-word-api.herokuapp.com/word?length=5"
  )
    .then((response) => response.json())
    .catch((e) => console.log(e.message));

  return word;
}
