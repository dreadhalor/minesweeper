import React, { useEffect, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import Header from './Header';
import './Window.scss';

interface AppType {
  id: string;
  coords: [number, number];
  icon: string;
  title: string;
  order: number;
  minimized: boolean;
  ref?: React.RefObject<HTMLDivElement>;
}

interface WindowProps {
  children: React.ReactNode;
  app: AppType;
  focusedApp: string | null;
  requestFocus: (id: string | null) => void;
  background_ref: React.RefObject<HTMLDivElement>;
  closeApp: (id: string) => void;
  setApps: React.Dispatch<React.SetStateAction<AppType[]>>;
  minimizeApp: (id: string) => void;
}

const Window: React.FC<WindowProps> = ({
  children,
  app,
  focusedApp,
  requestFocus,
  background_ref,
  closeApp,
  setApps,
  minimizeApp,
}) => {
  const window_ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    app.ref = window_ref;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bind = useDrag(
    (e) => {
      if (focusedApp !== app.id) requestFocus(app.id);
      setApps((prev_apps) => {
        app.coords = [app.coords[0] + e.delta[0], app.coords[1] + e.delta[1]];
        const new_apps = [...prev_apps];
        return new_apps;
      });
    },
    {
      bounds: background_ref,
      pointer: {
        capture: false,
      },
    },
  );

  const focused = focusedApp === app.id;

  const getAppCoords = () => {
    const [left, top] = app.coords;
    return { left, top };
  };

  return (
    <div
      className='window absolute flex-col'
      ref={window_ref}
      style={{
        ...getAppCoords(),
        zIndex: app.order,
        display: app.minimized ? 'none' : 'flex',
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        requestFocus(app.id);
      }}
    >
      <Header
        bind={bind}
        icon={app.icon}
        title={app.title}
        focused={focused}
        closeApp={() => closeApp(app.id)}
        minimizeApp={() => minimizeApp(app.id)}
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
