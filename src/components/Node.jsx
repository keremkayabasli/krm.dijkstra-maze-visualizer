import React from "react";
import "../styles/Node.css";

const Node = ({
  row,
  col,
  isStart,
  isFinish,
  isWall,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  let className = "node";
  if (isStart) className += " node-start";
  else if (isFinish) className += " node-finish";
  else if (isWall) className += " node-wall";

  return (
    <div
      id={`node-${row}-${col}`}
      className={className}
      onMouseDown={() => onMouseDown && onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter && onMouseEnter(row, col)}
      onMouseUp={() => onMouseUp && onMouseUp()}
    ></div>
  );
};

export default Node;
