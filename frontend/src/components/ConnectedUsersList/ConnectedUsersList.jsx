import PropTypes from "prop-types";

const ConnectedUsersList = ({ users }) => {
  return (
    <div className="max-w-md w-370 p-4 mt-5 flex flex-col items- backdrop-saturate-125 bg-white/20 rounded-2xl shadow-lg shadow-slate-900/60 ">
      <h2 className="text-xl font-bold mb-3">Usuarios Conectados:</h2>
      <ul className="list-disc pl-5">
        {users.map((user, index) => (
          <li key={index}>{user.username}</li>
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
