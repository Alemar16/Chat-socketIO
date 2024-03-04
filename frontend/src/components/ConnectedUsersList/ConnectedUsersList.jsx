import PropTypes from "prop-types";
import activoIcon from "../../assets/icons/activo.png";
import "../../App.css";


const ConnectedUsersList = ({ users }) => {
  return (
    <div className="max-w-xs w-52 h-60 p-4 mt-5 mx-auto flex flex-col items-center backdrop-saturate-125 bg-white/20 rounded-md shadow-lg shadow-slate-900/60 overflow-y-auto overflow-x-hidden">
      {/* Resto del código */}
      <h2 className="text-xl font-bold mb-3 text-center ">
        Usuarios Conectados
      </h2>
      <ul className="list-disc pl-2">
        {users.map((user, index) => (
          <li key={index} className="flex items-center">
            {" "}
            <img src={activoIcon} alt="" className="w-4 h-4 mr-2" />{" "}
            <span className="text-md truncate">{user.username}</span>
          </li>
        ))}
      </ul>
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
