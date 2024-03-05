import PropTypes from "prop-types";
import activoIcon from "../../assets/icons/activo.png";
import usersIcon from "../../assets/icons/users-icon.svg";
import "../../App.css";

const ConnectedUsersList = ({ users }) => {
  const connectedCount = users.length;

  return (
    <div className="max-w-xs w-55 h-60 p-4 mt-5 mx-auto flex flex-col items-center backdrop-saturate-125 bg-purple-300/80 rounded-md shadow-lg shadow-slate-900/60 overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-3 backdrop-saturate-125 bg-[#7A3EC2] rounded-md shadow-lg shadow-slate-900/60 py-2 px-4">
        <img
          src={usersIcon}
          alt=" Users"
          className="w-14 h-14 hover:scale-110"
        />
        <h2 className="text-xl font-bold text-center ">Connect Users</h2>
        <span className="bg-green-500 text-white rounded-md shadow-lg shadow-slate-900/60 w-12 h-12 flex items-center justify-center text-xl animate-pulse font-bold">
          {connectedCount > 999 ? "+999" : connectedCount}
        </span>
      </div>
      <div className="overflow-y-auto h-full">
        <ul className="list-disc pr-4">
          {users.map((user, index) => (
            <li
              key={index}
              className="flex items-center hover:bg-white rounded-md p-2"
            >
              <img src={activoIcon} alt="" className="w-4 h-4 mr-2" />
              <span className="text-md leading-6 truncate text-slate-600 cursor-pointer">
                {user.username}
              </span>
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
