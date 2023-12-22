//FormComponent.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const FormComponent = ({ onSubmit, username, onLogout }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  const handleLogout = () => {
    onLogout();
  };

  return (
    <div className="max-w-md w-full">
      {username && (
        <div className="flex justify-between items-center  mb-2 mt-2 px-5 gap-5">
          <span className="text-2xl font-bold text-white rounded-md font-mono p-2 ">
            Welcome, {username}!
          </span>

          <svg
            className="h-8 w-8 text-red-500 hover:text-red-700"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={handleLogout}
          >
            <title>Logout</title>
            <path stroke="none" d="M0 0h24v24H0z" />
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M7 12h14l-3 -3m0 6l3 -3" />
          </svg>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 pb-4 rounded">
        <div>
          <img
            src="/icons8-chat-100.png"
            alt="Logo-Chat"
            className="w-20 h-20 mx-auto mb-1"
          />
          <h1 className="text-3xl font-bold mb-5 text-center">
            Chat Socket.io
          </h1>
        </div>

        <div className="flex gap-3">
          <input
            placeholder="write your message ..."
            className="border-2 border-zinc-600 p-2 w-full rounded text-black bg-opacity-50 focus:bg-white focus:outline-none focus:bg-opacity-100 shadow-lg focus:shadow-indigo-900 transition-all duration-300"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="btn hover:bg-blue-800 shadow-lg shadow-indigo-900/80 cursor-pointer"
            type="submit"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};
FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default FormComponent;
