import PropTypes from "prop-types";
import { format } from "date-fns";
const ListMessageComponent = ({ messages }) => {
  return (
    <div className="max-w-[384px] w-full">
      {messages.length > 0 ? (
        <ul className="max-h-[339.13px] overflow-y-auto p-3 mb-5 scrollbar-none">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md shadow-lg shadow-indigo-900/80 relative ${
                message.from === "Me" ? "bg-purple-700 ml-auto" : "bg-blue-400"
              }`}
              style={{
                paddingBottom: "1.2rem",
                minWidth: "100px",
                borderRadius:
                  message.from === "Me"
                    ? "18px 18px 0 18px"
                    : "18px 18px 18px 0px",
              }}
            >
              {/* Contenido del mensaje */}
              <span className="text-xs text-slate-900 block font-sans font-semibold">
                {message.from}
              </span>{" "}
              <span
                className="text-sm font-poppins text-justify text-zinc-50"
                style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
              >
                {message.body}
              </span>
              {/* Marca de tiempo del mensaje */}
              {message.timestamp && (
                <span
                  className={` ${
                    message.from === "Me"
                      ? "text-zinc-300"
                      : "text-zinc-800 px-2"
                  } absolute bottom-1 right-1`}
                  style={{
                    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                    fontSize: "9px",
                  }}
                >
                  {format(new Date(message.timestamp), "hh:mm a", {
                    timeZone: "auto",
                  })}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="p-2 text-sm text-gray-800 flex items-center justify-center">
          No messages yet.
        </p>
      )}
    </div>
  );
};

ListMessageComponent.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      body: PropTypes.string.isRequired,
      from: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ListMessageComponent;
