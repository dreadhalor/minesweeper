// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.scss';

function App() {
  const [grid, setGrid] = useState(null);

  const clickCell = (row, col) => {
    if (!(grid[row][col].open || grid[row][col].flagged)) {
      const newGrid = [...grid];
      newGrid[row][col].open = 1;
      setGrid(newGrid);
    }
  };
  const flagCell = (row, col) => {
    const newGrid = [...grid];
    if (newGrid[row][col].flagged) newGrid[row][col].flagged = 0;
    else newGrid[row][col].flagged = 1;
    setGrid(newGrid);
  };

  const createGrid = (rows, cols) => {
    const result = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          val: 0,
          open: 0,
          flagged: 0,
        });
      }
      result.push(row);
    }
    setBombs(result, 100);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (result[i][j].val !== -1)
          result[i][j].val = getMineCount(result, i, j);
      }
    }
    return result;
  };

  const setBombs = (candidate_grid, bombs) => {
    let rows = candidate_grid.length;
    let cols = candidate_grid[0].length;
    let total_cells = rows * cols;
    let bomb_indices = [];
    while (bombs > 0) {
      let next_index = Math.floor(Math.random() * total_cells);
      if (!bomb_indices.includes(next_index)) {
        bomb_indices.push(next_index);
        bombs--;
      }
    }
    let result = bomb_indices.map((index) => [
      Math.floor(index / cols),
      index % cols,
    ]);
    result.forEach(([row, col]) => {
      candidate_grid[row][col].val = -1;
    });
    return candidate_grid;
  };

  const getNeighbors = (candidate_grid, row, col) => {
    let min_row = Math.max(row - 1, 0);
    let max_row = Math.min(row + 1, candidate_grid.length - 1);
    let min_col = Math.max(col - 1, 0);
    let max_col = Math.min(col + 1, candidate_grid[0].length - 1);
    let result = [];
    for (let i = min_row; i <= max_row; i++) {
      for (let j = min_col; j <= max_col; j++) {
        if (i !== row || j !== col) {
          result.push([i, j]);
        }
      }
    }
    return result;
  };
  const getMineCount = (candidate_grid, row, col) => {
    let neighbor_coords = getNeighbors(candidate_grid, row, col);
    let neighbor_cells = neighbor_coords.map(
      ([row, col]) => candidate_grid[row][col]
    );
    let mine_count = neighbor_cells.filter((cell) => cell.val === -1).length;
    return mine_count;
  };

  const getBorder = (cell) => {
    if (cell.open === 1) {
      return 'border-l border-t border-[#808080]';
    }
    return 'minesweeper-border-colors-outset border-[3px]';
  };

  const getCharacter = (cell) => {
    if (cell.open) {
      if (cell.val === -1) return '💣';
      if (cell.val > 0) return cell.val;
      return cell.val;
    } else if (cell.flagged) {
      return '🚩';
    }
    return '';
  };

  useEffect(() => {
    if (grid === null) {
      setGrid(createGrid(16, 16));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='h-full bg-slate-100 flex flex-row w-full'>
      <div className='flex flex-col m-auto bg-[#ece9d8]'>
        <div className='w-full h-[35px] rounded-t-lg bg-[#0855dd]'></div>
        <div className='flex flex-col border-4 border-[#0855dd]'>
          <div className='h-[25px]'></div>
          <div className='w-full bg-[#c0c0c0] border-l-4 border-t-4 border-white flex flex-col p-2 gap-2'>
            <div className='h-[40px] minesweeper-border-colors-inset border-2'></div>
            <div
              className='minesweeper-border-colors-inset border-4 grid'
              style={{
                gridTemplateColumns: `repeat(${grid?.[0]?.length}, auto)`,
              }}
            >
              {grid &&
                grid.map((row, row_index) =>
                  row.map((cell, col_index) => (
                    <div
                      className={`${getBorder(
                        cell
                      )} w-[25px] h-[25px] flex justify-center items-center`}
                      key={`${row_index},${col_index}`}
                      onClick={() => {
                        clickCell(row_index, col_index);
                      }}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        flagCell(row_index, col_index);
                      }}
                    >
                      {getCharacter(cell)}
                    </div>
                  ))
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
