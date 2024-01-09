import PropTypes from "prop-types";
import { format } from "date-fns";

const ListMessageComponent = ({ messages }) => {
  return (
    <div className="max-w-sm w-full">
      <ul className="max-h-70 p-3 mb-5 overflow-y-auto scrollbar-none">
  {messages.length > 0 ? (
    messages.map((message, index) => (
      <li
        key={index}
        className={`my-2 p-2 table text-sm rounded-md shadow-lg shadow-indigo-900/80 relative ${
          message.from === "Me" ? "bg-purple-900 ml-auto" : "bg-blue-400"
        }`}
        style={{ paddingBottom: '1.2rem', minWidth: '100px' }} 
      >
        <span className="text-xs text-slate-900 block font-sans">
          {message.from}
        </span>{" "}
        <span className="text-lg font-poppins text-justify text-zinc-50 font-bold">
          {message.body}
        </span>
        {message.timestamp && (
          <span className="text-xs text-zinc-300 absolute bottom-1 right-1">
            {format(new Date(message.timestamp), "hh:mm a", { timeZone: "auto" })}
          </span>
        )}
      </li>
    ))
  ) : (
    <li className="p-2 text-sm text-gray-800 flex items-center justify-center">
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
      timestamp: PropTypes.string.isRequired, // Asegúrate de que timestamp esté definido como una cadena
    })
  ).isRequired,
};

export default ListMessageComponent;
