import './Taskbar.scss';

const Taskbar = () => {
  return (
    <div className='taskbar-gradient z-10 flex h-[30px]'>
      <img
        src={require('../../assets/start.png')}
        alt='start'
        className='h-full'
      />
    </div>
  );
};

export default Taskbar;
