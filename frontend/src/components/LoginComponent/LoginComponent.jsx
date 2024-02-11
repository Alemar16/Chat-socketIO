import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";

const LoginComponent = ({ onLogin, onLoginAsAnonymous, modal }) => {
  const [username, setUsername] = useState("");



  const handleLogin = () => {
    console.log("Login button clicked with username:", username);
    onLogin(username);
  };

  const handleLoginAnonymous = () => {
    //console.log("Login as Anonymous button clicked");
    onLoginAsAnonymous();
  };

  return (
    <div>
       <Modal/>
      <div className="flex items-center shadow-lg p-2">
        <img src="/icons8-chat-100.png" alt="Logo-Chat" />
        <h1 className="text-xl font-bold mb-5">Chat Socket.io</h1>
      </div>
      <div className="flex flex-col items-center shadow-lg p-2">
        <div className="flex gap-3">
          <input
            placeholder="Enter your username..."
            className="border-none focus:outline-none bg-white text-gray-700 rounded-l-lg p-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue"
          >
            Login
          </button>
        </div>
        <button
          type="button"
          onClick={handleLoginAnonymous}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg mt-3 hover:bg-gray-600 focus:outline-none focus:shadow-outline-blue"
        >
          Ingresar como Anónimo
        </button>
      </div>
    </div>
  );
};

LoginComponent.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onLoginAsAnonymous: PropTypes.func.isRequired,
};

export default LoginComponent;
