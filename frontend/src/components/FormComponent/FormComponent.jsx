//FormComponent.jsx
import { useState } from "react";
import PropTypes from "prop-types";

const FormComponent = ({ onSubmit, username }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage("");
  };

  return (
    <div className="max-w-md w-full">
      {username && (
        <div className="text-center mb-5">
          <p>Welcome, {username}!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-8 pb-4 rounded">
        <div>
          <img src="/icons8-chat-100.png" alt="" />
          <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
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
};

export default FormComponent;
