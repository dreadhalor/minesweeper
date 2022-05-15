import { forwardRef } from 'react';
import Header from './Header';
import './Window.scss';

const Window = forwardRef(
  ({ children, windowCoords, bind, icon, title }, ref) => {
    return (
      <div
        className='absolute flex flex-col'
        ref={ref}
        style={{
          left: windowCoords[0],
          top: windowCoords[1],
        }}
      >
        <Header bind={bind} icon={icon} title={title} />
        <div className='border-x-[3px] border-b-[3px] border-[rgb(8,49,217)] bg-[#ece9d8]'>
          {children}
        </div>
      </div>
    );
  }
);

export default Window;
