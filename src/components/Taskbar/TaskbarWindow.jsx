const TaskbarWindow = ({ id, icon, title, onMouseDown, focused }) => {
  function _onMouseDown() {
    onMouseDown(id);
  }
  return (
    <div
      onMouseDown={_onMouseDown}
      className={`footer__window ${focused ? 'focus' : 'cover'}`}
    >
      <img className='footer__icon' src={icon} alt={title} />
      <div className='footer__text'>{title}</div>
    </div>
  );
};

export default TaskbarWindow;
