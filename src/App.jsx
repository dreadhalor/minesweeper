// import logo from './logo.svg';
import bliss from './assets/bliss.jpeg';
import minesweeper_icon from './assets/minesweeper/minesweeper-icon.png';
import { useEffect, useRef, useState } from 'react';
import './App.scss';
import { useDrag } from '@use-gesture/react';
import Icon from './components/Icon';
import Window from './components/Window/Window';
import Minesweeper from './components/Minesweeper/Minesweeper';
import Taskbar from './components/Taskbar/Taskbar';
import { v4 as uuidv4 } from 'uuid';

function App() {
  // const window_ref = useRef(null);
  const background_ref = useRef(null);
  const [selectionCoords, setSelectionCoords] = useState(null);
  const [selectionSize, setSelectionSize] = useState(null);
  const [focusedApp, setFocusedApp] = useState(null);
  const [apps, setApps] = useState([{ id: uuidv4() }]);

  const cols = 16,
    cell_size = 16;

  const openApp = () => {
    const newApps = [...apps];
    newApps.push({
      id: uuidv4(),
      coords: [10, 10],
    });
    setApps(newApps);
  };
  const closeApp = (id) => {
    const newApps = apps.filter((app) => app.id !== id);
    setApps(newApps);
  };

  const requestFocus = (id) => {
    setFocusedApp(id);
    const sorted = [...apps].sort((a, b) => {
      if (a.id === id) return 1;
      if (b.id === id) return -1;
      return 0;
    });
    setApps(sorted);
  };

  const bind = useDrag(
    (e) => {
      if (e.active && e.target === background_ref.current) {
        setFocusedApp(null);
        // get the top left corner
        let top_left = [
          Math.min(e.initial[0], e.xy[0]),
          Math.min(e.initial[1], e.xy[1]),
        ];
        // get the bottom right corner
        let bottom_right = [
          Math.max(e.initial[0], e.xy[0]),
          Math.max(e.initial[1], e.xy[1]),
        ];
        // get the width and height
        let width = bottom_right[0] - top_left[0];
        let height = bottom_right[1] - top_left[1];
        // set the selection size
        setSelectionSize([width, height]);
        // set the selection coordinates
        setSelectionCoords([top_left[0], top_left[1]]);
      } else {
        setSelectionSize(null);
        setSelectionCoords(null);
      }
    },
    { bounds: background_ref, pointer: { capture: false } }
  );

  useEffect(() => {
    // setWindowCoords([
    //   Math.max(
    //     (background_ref.current.offsetWidth -
    //       (window_ref.current.offsetWidth + cols * cell_size)) /
    //       2,
    //     0
    //   ),
    //   Math.max(
    //     (background_ref.current.offsetHeight -
    //       (window_ref.current.offsetHeight + cols * cell_size)) /
    //       2,
    //     0
    //   ),
    // ]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='flex h-full w-full flex-col'>
      <div
        {...bind()}
        ref={background_ref}
        className='relative w-full flex-1'
        style={{
          backgroundImage: `url(${bliss})`,
          backgroundSize: 'cover',
          touchAction: 'none',
        }}
      >
        <Icon
          src={minesweeper_icon}
          name={'Minesweeper'}
          coords={[40, 40]}
          selection={[selectionCoords, selectionSize]}
          onDoubleClick={openApp}
        />
        <div
          className='absolute h-10 w-10 border-2 border-blue-400 bg-blue-200 opacity-50'
          style={{
            display: selectionSize ? 'block' : 'none',
            left: selectionCoords ? `${selectionCoords[0]}px` : 0,
            top: selectionCoords ? `${selectionCoords[1]}px` : 0,
            width: selectionSize ? `${selectionSize[0]}px` : 0,
            height: selectionSize ? `${selectionSize[1]}px` : 0,
          }}
        ></div>
        {apps.map((app) => (
          <Window
            key={app.id}
            id={app.id}
            icon={minesweeper_icon}
            title={'Minesweeper'}
            focusedApp={focusedApp}
            requestFocus={requestFocus}
            background_ref={background_ref}
            closeApp={closeApp}
          >
            <Minesweeper />
          </Window>
        ))}
      </div>
      <Taskbar />
    </div>
  );
}

export default App;
