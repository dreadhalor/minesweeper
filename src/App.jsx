// import logo from './logo.svg';
// import bliss from './assets/bliss.jpeg';
import { useEffect, useRef, useState } from 'react';
import './App.scss';

import { useDrag } from '@use-gesture/react';

function App() {
  const [grid, setGrid] = useState(null);
  const [windowCoords, setWindowCoords] = useState([10, 10]);
  const window_ref = useRef(null);

  const rows = 16,
    cols = 16,
    bombs = 25,
    cell_size = 25;

  const bind = useDrag(
    (e) => {
      setWindowCoords([
        windowCoords[0] + e.delta[0],
        windowCoords[1] + e.delta[1],
      ]);
    },
    { bounds: document.body }
  );

  const clickCell = (row, col) => {
    if (grid[row][col].val === -2) formatGrid(row, col);
    if (!(grid[row][col].open || grid[row][col].flagged)) {
      const newGrid = [...grid];
      openCell(newGrid, row, col);
      setGrid(newGrid);
    }
  };
  const openCell = (candidate_grid, row, col) => {
    if (!candidate_grid[row][col].flagged) {
      if (candidate_grid[row][col].val === 0) {
        let stack = [[row, col]];
        while (stack.length > 0) {
          const [r, c] = stack.pop();
          let cell = candidate_grid[r][c];
          if (cell.val > -1 && !cell.open) {
            cell.open = 1;
            if (cell.val === 0) {
              let neighbor_cells = getNeighbors(candidate_grid, r, c);
              let zeroes = neighbor_cells.filter(
                ([r, c]) =>
                  candidate_grid[r][c].val !== -1 &&
                  candidate_grid[r][c].open === 0
              );
              stack = stack.concat(zeroes);
            }
          }
        }
      } else candidate_grid[row][col].open = 1;
    }
  };

  const flagCell = (row, col) => {
    const newGrid = [...grid];
    if (newGrid[row][col].flagged) newGrid[row][col].flagged = 0;
    else newGrid[row][col].flagged = 1;
    setGrid(newGrid);
  };

  const createEmptyGrid = (rows, cols) => {
    const result = [];
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        row.push({
          val: -2,
          open: 0,
          flagged: 0,
        });
      }
      result.push(row);
    }
    return result;
  };
  const formatGrid = (starting_row, starting_column) => {
    const result = [...grid];
    setBombs(result, bombs, starting_row * cols + starting_column);
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (result[i][j].val !== -1)
          result[i][j].val = getMineCount(result, i, j);
      }
    }
    setGrid(result);
  };

  const setBombs = (candidate_grid, bombs, starting_index = null) => {
    let rows = candidate_grid.length;
    let cols = candidate_grid[0].length;
    let total_cells = rows * cols;
    let bomb_indices = [];
    if (bombs > total_cells) bombs = total_cells;
    let survivable = bombs < total_cells;
    if (survivable) {
      while (bomb_indices.length < bombs) {
        let next_index = Math.floor(Math.random() * total_cells);
        if (
          !bomb_indices.includes(next_index) &&
          next_index !== starting_index
        ) {
          bomb_indices.push(next_index);
        }
      }
    } else bomb_indices = [...Array(total_cells).keys()];
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
      return '';
    } else if (cell.flagged) {
      return '🚩';
    }
    return '';
  };
  const num_colors = {
    1: '#0000fd',
    2: '#017e00',
    3: '#fe0000',
    4: '#010180',
    5: '#810101',
    6: '#008080',
    7: 'black',
    8: '#808080',
  };

  useEffect(() => {
    if (grid === null) {
      setGrid(() => createEmptyGrid(16, 16));
      setWindowCoords([
        (document.body.offsetWidth -
          (window_ref.current.offsetWidth + cols * cell_size)) /
          2,
        (document.body.offsetHeight -
          (window_ref.current.offsetHeight + cols * cell_size)) /
          2,
      ]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className='relative flex h-full w-full flex-row'
      style={{
        backgroundImage: 'url(/assets/bliss.jpeg)',
        backgroundSize: 'cover',
      }}
    >
      <div
        className='absolute flex flex-col'
        style={{
          left: windowCoords[0],
          top: windowCoords[1],
          // transformOrigin: 'center center',
        }}
        ref={window_ref}
      >
        <div
          {...bind()}
          className='h-[35px] w-full rounded-t-lg bg-[#0855dd]'
          style={{ touchAction: 'none' }}
        ></div>
        <div className='flex flex-col border-4 border-[#0855dd] bg-[#ece9d8]'>
          <div className='h-[25px]'></div>
          <div className='flex w-full flex-col gap-2 border-l-4 border-t-4 border-white bg-[#c0c0c0] p-2'>
            <div className='minesweeper-border-colors-inset h-[40px] border-2'></div>
            <div
              className='minesweeper-border-colors-inset grid border-4'
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
                      )} flex items-center justify-center text-xl font-extrabold`}
                      style={{
                        height: `${cell_size}px`,
                        width: `${cell_size}px`,
                        color: num_colors?.[cell.val] ?? 'black',
                      }}
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
