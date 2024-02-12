import React from 'react';

function Header() {
  return (
    <div className="text-center">
      <img
        src="/icons8-chat-100.png"
        alt="Logo-Chat"
        className="w-20 h-20 mx-auto mb-1"
      />
      {/* Aplica la fuente Boogaloo al elemento <h1> */}
      <h1 className="text-3xl font-bold mb-5" style={{ fontFamily: 'Boogaloo, cursive', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
      <span style={{ color: '#852CA5', textStroke: '2px #000' }}>Flash</span><span style={{ color: '#4CCFF1'  }}>Chat</span>
      </h1>
    </div>
  );
}

export default Header;
