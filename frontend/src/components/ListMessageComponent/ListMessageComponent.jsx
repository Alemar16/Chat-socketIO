import PropTypes from "prop-types";

const ListMessageComponent = ({ messages }) => {
  return (
    <div className="max-w-md w-full">
      {/* Establece el ancho máximo y ancho completo */}
      <ul className="max-h-60 p-4 mb-5 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md ${
                message.from === "Me" ? "bg-purple-900 ml-auto" : "bg-blue-400"
              }`}
            >
              <span className="text-xs text-slate-900 block">
                {message.from}
              </span>{" "}
              <span className="text-md font-bold shadow">{message.body}</span>
            </li>
          ))
        ) : (
          <li className="p-2 text-sm text-gray-500 flex items-center justify-center">
            No messages yet.
          </li>
        )}
      </ul>
    </div>
  );
};

ListMessageComponent.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ListMessageComponent;
