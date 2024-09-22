import React from 'react';
import './Taskbar.scss';
import TaskbarTime from './TaskbarTime';
import TaskbarWindow from './TaskbarWindow';
import Start from '../../assets/start.png';
import { useAchievements } from 'dread-ui';

interface AppType {
  id: string;
  icon: string;
  title: string;
  minimized: boolean;
  order: number;
}

interface TaskbarProps {
  apps: AppType[];
  focusedApp: string | null;
  taskbarWindowClicked: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  focusedApp,
  taskbarWindowClicked,
}) => {
  const { unlockAchievementById } = useAchievements();
  return (
    <div className='taskbar taskbar-gradient z-10 flex h-[30px] flex-row'>
      <img
        src={Start}
        alt='start'
        className='mr-[10px] h-full'
        onClick={() => unlockAchievementById('click_start', 'minesweeper')}
      />
      {apps.map((app) => (
        <TaskbarWindow
          app={app}
          focusedApp={focusedApp}
          taskbarWindowClicked={taskbarWindowClicked}
          key={app.id}
        />
      ))}
      <TaskbarTime />
    </div>
  );
};

export default Taskbar;
