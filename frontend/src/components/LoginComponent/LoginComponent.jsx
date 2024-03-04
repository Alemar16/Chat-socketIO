import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Swal from "sweetalert2";
import anonymousIcon from "../../assets/icons/icons8-anonymous-user-with-hat-and-glasses-layout-96.png";
import TermsAndConditions from "../TermsAndConditions/TermsAndConditions";

const LoginComponent = ({ onLogin, onLoginAsAnonymous, modal }) => {
  const [username, setUsername] = useState("");

  const handleLogin = () => {
    console.log("Login button clicked with username:", username);
    onLogin(username);
  };

  const handleLoginAnonymous = async () => {
    const { value: accept } = await Swal.fire({
      title: "Terms and Conditions",
      input: "checkbox",
      inputPlaceholder: `I agree with the terms and conditions`,
      confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,
      inputValidator: (result) => {
        return !result && "You need to agree with the terms and conditions";
      },
    });

    if (accept) {
      Swal.fire({
        title: "Anonymous Mode Activated",
        html: `
          <p>
            By using anonymous mode, your identity will be protected and a random nickname will be assigned to you while connected.
          </p>
          <p>
            All data associated with your session will be deleted upon disconnection.
          </p>
        `,
        icon: "success",
        imageUrl: anonymousIcon,
        imageWidth: 80,
        confirmButtonText: "Ok",
      });
      onLoginAsAnonymous();
    }
  };

  return (
    <div>
      <Modal />
      <div className="flex items-center justify-center shadow-lg p-2">
        {" "}
        {/* Alinea los elementos al centro horizontal y verticalmente */}
        <img
          src="/icons8-chat-100.png"
          alt="Chat Logo"
          className="w-20 h-20 mb-1" // Reduce el margen inferior de la imagen
        />
        <h1
          className="text-4xl font-bold mb-5"
          style={{
            fontFamily: "Boogaloo, cursive",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
          }}
        >
          {" "}
          {/* Aumenta el tamaño de la fuente */}
          <span style={{ color: "#852CA5", textStroke: "2px #000" }}>
            Flash
          </span>
          <span style={{ color: "#4CCFF1" }}>Chat</span>
        </h1>
      </div>

      <div className="flex flex-col items-center shadow-lg p-2">
        <div className="flex gap-1 h-10">
          {" "}
          <input
            placeholder="Enter your username..."
            className="border-none focus:outline-none bg-white text-gray-700 rounded-l-lg p-2 h-full" // Aplica la altura completa al input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            onClick={handleLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue h-full" // Aplica la altura completa al botón
          >
            Login
          </button>
          <button
            type="button"
            onClick={handleLoginAnonymous}
            className="flex justify-center items-center ml-3 hover: transform hover:scale-110 duration-300"
            title="Anonymous Mode"
          >
            <img src={anonymousIcon} alt="Anonymous Icon" className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

LoginComponent.propTypes = {
  onLogin: PropTypes.func.isRequired,
  onLoginAsAnonymous: PropTypes.func.isRequired,
};

export default LoginComponent;
