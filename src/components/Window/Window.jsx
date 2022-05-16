import { useDrag } from '@use-gesture/react';
import { useEffect, useRef, useState } from 'react';
import Header from './Header';
import './Window.scss';

const Window = ({
  children,
  id,
  icon,
  title,
  focusedApp,
  requestFocus,
  background_ref,
  closeApp,
}) => {
  const [focused, setFocused] = useState(false);
  const [window_coords, setWindowCoords] = useState([0, 0]);

  const window_ref = useRef(null);

  const bind = useDrag(
    (e) => {
      setWindowCoords([
        window_coords[0] + e.delta[0],
        window_coords[1] + e.delta[1],
      ]);
    },
    {
      bounds: background_ref,
      pointer: {
        capture: false,
      },
    }
  );

  useEffect(() => {
    if (focusedApp === id) {
      setFocused(true);
    } else {
      setFocused(false);
    }
  }, [focusedApp, id]);

  return (
    <div
      className='absolute flex flex-col'
      ref={window_ref}
      style={{
        left: window_coords[0],
        top: window_coords[1],
      }}
      onMouseDown={() => requestFocus(id)}
    >
      <Header
        bind={bind}
        icon={icon}
        title={title}
        focused={focused}
        closeApp={() => closeApp(id)}
      />
      <div
        className='border-x-[3px] border-b-[3px] bg-[#ece9d8]'
        style={{
          borderColor: focused ? '#0831d9' : '#6582f5',
        }}
      >
        {children}
      </div>
    </div>
  );
};
export default Window;
