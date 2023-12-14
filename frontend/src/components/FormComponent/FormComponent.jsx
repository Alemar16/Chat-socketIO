import { useState } from "react";
import PropTypes from "prop-types";

const FormComponent = ({ onSubmit }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message);
    setMessage(" ");
  };

  return (
    <div className="max-w-md w-full">
      {" "}
      {/* Establece el ancho máximo y ancho completo */}
      <form onSubmit={handleSubmit} className="p-8 pb-2 rounded">
       
        <div>
          <img src="/icons8-chat-100.png" alt="" />
          <h1 className="text-3xl font-bold mb-5">Chat Socket.io</h1>
        </div>

        <div className=" flex gap-3">
          <input
            placeholder="write your message ..."
            className="border-2 border-zinc-600 p-2 w-full rounded text-black shadow-lg shadow-indigo-900/80 "
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn hover:bg-blue-800 shadow-lg shadow-indigo-900/80 cursor-pointer ">Send</button>
        </div>
      </form>
    </div>
  );
};

FormComponent.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default FormComponent;
