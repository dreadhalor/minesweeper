import './Window.scss';

const Header = ({ bind, icon, title }) => {
  return (
    <div
      {...bind()}
      className='relative h-[28px] w-full flex-row overflow-hidden rounded-t-[8px]'
      style={{ touchAction: 'none' }}
    >
      <div className='header header-gradient-focused absolute left-0 top-0 right-0 bottom-0'></div>
      <div className='header-buttons-container absolute left-0 right-0 bottom-0 flex h-[25px] flex-row items-center px-[3px] pb-[1px]'>
        <img
          src={icon}
          alt={title}
          className='app__header__icon'
          style={{
            pointerEvents: 'none',
            width: '15px',
            height: '15px',
            marginLeft: '1px',
            marginRight: '3px',
          }}
        />
        <div
          className='flex-1 text-[12px] font-semibold leading-[25px] tracking-[0.5px] text-white'
          style={{ textShadow: 'rgb(0 0 0) 1px 1px' }}
        >
          {title}
        </div>
        <div className='header_button header__button--minimize'></div>
        <div className='header_button header__button--maximize'></div>
        <div className='header_button header__button--close'></div>
      </div>
    </div>
  );
};

export default Header;
