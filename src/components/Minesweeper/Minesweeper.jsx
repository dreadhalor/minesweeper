import { useState, useEffect } from 'react';
import Grid from './components/Grid/Grid';
import ScoreBar from './components/ScoreBar/ScoreBar';
import './Minesweeper.scss';

const Minesweeper = () => {
  const [grid, setGrid] = useState(null);
  const [seconds, setSeconds] = useState(0);
  const [status, setStatus] = useState('new');

  const reset = () => {
    setGrid(() => createEmptyGrid(16, 16));
    setSeconds(0);
    setStatus('new');
  };

  function addSecond() {
    setSeconds((sec) => sec + 1);
  }
  useEffect(() => {
    let timer;
    switch (status) {
      case 'started':
        timer = setInterval(addSecond, 1000);
        break;
      case 'new':
        setSeconds(0);
        break;
      default:
        break;
    }
    return () => clearInterval(timer);
  }, [status]);

  const rows = 16,
    cols = 16,
    bombs = 40;

  const clickCell = (row, col) => {
    if (grid[row][col].val === -2) formatGrid(row, col);
    if (!(grid[row][col].open || grid[row][col].flagged)) {
      const newGrid = [...grid];
      openCell(newGrid, row, col);
      setGrid(newGrid);
      setStatus('started');
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
    newGrid[row][col].flagged = (newGrid[row][col].flagged + 1) % 3;
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
  const getRemainingMines = () => {
    return bombs - grid?.flat(1).filter((cell) => cell.flagged === 1).length;
  };

  useEffect(() => {
    if (grid === null) {
      setGrid(() => createEmptyGrid(16, 16));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex h-full w-full flex-col'>
      {/* <div className='h-[20px]'></div> */}
      <div className='flex w-full flex-col gap-[5px] border-l-[3px] border-t-[3px] border-[rgb(245,245,245)] bg-[#c0c0c0] p-[5px]'>
        <ScoreBar
          mines_remaining={getRemainingMines()}
          seconds_elapsed={seconds}
          reset={reset}
        />
        <Grid grid={grid} clickCell={clickCell} flagCell={flagCell} />
      </div>
    </div>
  );
};

export default Minesweeper;
