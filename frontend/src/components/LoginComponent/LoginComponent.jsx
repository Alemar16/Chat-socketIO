import PropTypes from "prop-types";
import { useState } from "react";

const LoginComponent = ({ onLogin }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    console.log("Login button clicked with username:", username);
    onLogin(username);
  };

  return (
    <div className="flex gap-3">
      <input
        placeholder="Enter your username..."
        className="border-2 border-zinc-600 p-2 w-full rounded text-black bg-opacity-50 focus:bg-white focus:outline-none focus:bg-opacity-100 shadow-lg focus:shadow-indigo-900 transition-all duration-300"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button
        type="button"
        onClick={handleLogin}
        className="btn hover:bg-blue-800 shadow-lg shadow-indigo-900/80 cursor-pointer"
      >
        Login
      </button>
    </div>
  );
};

LoginComponent.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default LoginComponent;
