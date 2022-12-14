import Tile from "./Tile";

export default function Board(props) {
  const { tiles, keys, rowStatus } = props;
  return (
    <div className="board">
      {tiles.map((tileRow) => {
        return tileRow.map((tileDetails, index) => {
          let tile = tileDetails;
          if (typeof tileDetails === "number") {
            tile = { label: keys[tileDetails].label };
          }
          return <Tile key={index} {...tile} status={rowStatus} />;
        });
      })}
    </div>
  );
}
