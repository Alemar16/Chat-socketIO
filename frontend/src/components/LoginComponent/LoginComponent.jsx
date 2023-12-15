import PropTypes from "prop-types";
import { useState } from "react";

const LoginComponent = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    console.log("Login button clicked with username:", username);
    onLogin(username);
  };

  return (
    <div>
      <div className="flex items-center shadow-lg p-2">
        <img src="/icons8-chat-100.png" alt="Logo-Chat" />
        <h1 className="text-xl font-bold mb-5">Chat Socket.io</h1>
      </div>
      <div className="flex items-center shadow-lg p-2">
        <input
          placeholder="Enter your username..."
          className="border-none focus:outline-none bg-white text-gray-700 rounded-l-lg p-2 w-full"
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
    </div>
  );
};

LoginComponent.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginComponent;
