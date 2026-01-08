import React, { useState } from "react";
import Grid from "./components/Grid";
import { dijkstra } from "./algorithms/dijkstra";
import "./styles/App.css";

function App() {
  const [grid, setGrid] = useState(createInitialGrid());
  const [mouseIsPressed, setMouseIsPressed] = useState(false);

  function createInitialGrid() {
    const rows = 20;
    const cols = 50;
    const grid = [];

    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({
          row,
          col,
          isStart: row === 10 && col === 5,
          isFinish: row === 10 && col === 45,
          isWall: false,
          distance: Infinity,
          isVisited: false,
          previousNode: null,
        });
      }
      grid.push(currentRow);
    }
    return grid;
  }

  /* ===== MOUSE HANDLERS ===== */
  const onMouseDown = (row, col) => {
    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (!node.isStart && !node.isFinish) {
      node.isWall = !node.isWall;
    }

    setGrid(newGrid);
    setMouseIsPressed(true);
  };

  const onMouseEnter = (row, col) => {
    if (!mouseIsPressed) return;

    const newGrid = grid.slice();
    const node = newGrid[row][col];

    if (!node.isStart && !node.isFinish) {
      node.isWall = true;
    }

    setGrid(newGrid);
  };

  const onMouseUp = () => {
    setMouseIsPressed(false);
  };

  /* ===== CLEAR FUNCTIONS ===== */
  const clearWalls = () => {
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
        distance: Infinity,
        isVisited: false,
        previousNode: null,
      }))
    );

    setGrid(newGrid);

    document.querySelectorAll(".node").forEach(el => {
      el.classList.remove("node-visited", "node-shortest-path");
    });
  };

  const resetBoard = () => {
    setGrid(createInitialGrid());

    document.querySelectorAll(".node").forEach(el => {
      el.classList.remove("node-visited", "node-shortest-path");
    });
  };

  /* ===== DIJKSTRA ===== */
  const visualizeDijkstra = () => {
    const startNode = grid[10][5];
    const finishNode = grid[10][45];

    const visitedNodes = dijkstra(grid, startNode, finishNode);

    const shortestPath = [];
    let currentNode = finishNode;
    while (currentNode) {
      shortestPath.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }

    visitedNodes.forEach((node, i) => {
      setTimeout(() => {
        const el = document.getElementById(`node-${node.row}-${node.col}`);
        if (el) el.classList.add("node-visited");
      }, 10 * i);
    });

    setTimeout(() => {
      shortestPath.forEach((node, i) => {
        setTimeout(() => {
          const el = document.getElementById(`node-${node.row}-${node.col}`);
          if (el) el.classList.add("node-shortest-path");
        }, 30 * i);
      });
    }, 10 * visitedNodes.length);
  };

  /* ===== MAZE GENERATOR ===== */
  const generateMaze = () => {
    const newGrid = grid.map(row =>
      row.map(node => {
        if (!node.isStart && !node.isFinish) {
          // %30 ihtimalle duvar yap
          node.isWall = Math.random() < 0.3;
        }
        node.distance = Infinity;
        node.isVisited = false;
        node.previousNode = null;
        return node;
      })
    );

    setGrid(newGrid);

    document.querySelectorAll(".node").forEach(el => {
      el.classList.remove("node-visited", "node-shortest-path");
    });
  };

  return (
    <div className="App">
      <button onClick={visualizeDijkstra}>Visualize Dijkstra</button>
      <button onClick={clearWalls}>Clear Walls</button>
      <button onClick={resetBoard}>Reset Board</button>
      <button onClick={generateMaze}>Generate Maze</button>

      <Grid
        grid={grid}
        handlers={{
          onMouseDown,
          onMouseEnter,
          onMouseUp,
        }}
      />
    </div>
  );
}

export default App;
