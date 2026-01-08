
import PropTypes from 'prop-types';

function Header({ compact = false }) {
  return (
    <div className={`${compact ? 'flex items-center gap-3' : 'text-center'}`}>
      <img
        src="/icons8-chat-100.png"
        alt="Logo-Chat"
        className={`${compact ? 'w-12 h-12' : 'w-20 h-20 mx-auto mb-1'}`}
      />
      {/* Aplica la fuente Boogaloo al elemento <h1> */}
      <h1 
        className={`${compact ? 'text-2xl mb-0' : 'text-3xl font-bold mb-5'}`} 
        style={{ fontFamily: 'Boogaloo, cursive', textShadow: '2px 2px 4px #000' }}
      >
        <span style={{ color: '#852CA5' }}>Flash</span><span style={{ color: '#4CCFF1'  }}>Chat</span>
      </h1>
    </div>
  );
}

Header.propTypes = {
  compact: PropTypes.bool,
};

export default Header;
