import PropTypes from "prop-types";
import activoIcon from "../../assets/icons/activo.png";
import "../../App.css";

const ConnectedUsersList = ({ users }) => {
  // Calcula el número de usuarios conectados
  const connectedCount = users.length;

  return (
    <div className="max-w-xs w-55 h-60 p-4 mt-5 mx-auto flex flex-col items-center backdrop-saturate-125 bg-white/20 rounded-md shadow-lg shadow-slate-900/60 overflow-hidden">
      {/* Título y contador */}
      <div className="flex items-center justify-between gap-2 mb-3 backdrop-saturate-125 bg-white/20 rounded-md shadow-lg shadow-slate-900/60 py-2 px-4">
        <h2 className="text-xl font-bold text-center">Usuarios Conectados</h2>
        <span className="bg-green-500 text-white rounded-full shadow-lg shadow-slate-900/60 w-10 h-10 flex items-center justify-center text-lg">
          {connectedCount}
        </span>
      </div>
      {/* Contenido desplazable */}
      <div className="overflow-y-auto h-full">
        <ul className="list-disc pr-4">
          {/* Lista de usuarios */}
          {users.map((user, index) => (
            <li key={index} className="flex items-center">
              <img src={activoIcon} alt="" className="w-4 h-4 mr-2" />
              <span className="text-md truncate">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ConnectedUsersList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ConnectedUsersList;
