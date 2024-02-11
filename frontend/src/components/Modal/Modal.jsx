import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Modal = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const modal = Swal.fire({
      title:
        'Bienvenido a <br> <span class="text-blue-800">Flash</span><span class="text-purple-500">Chat</span>',
      titleStyle: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#000000",
      },
      imageUrl: "/icons8-chat-100.png",
      html: `
        <p><strong>Para chatear o crear un grupo sigue estos sencillos pasos:</strong></p><br>
        <ol>
          <li>Ingresa tu nombre y haz clic en "Login" o "Ingresar como Anónimo".</li>
          <br>
          <li>Comparte este enlace:</li>
          <br>
          <button id="enlace" style="background-color: #ffffff; border: 1px solid #3182ce; color: #3182ce; padding: 8px 16px; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 4px; transition: background-color 0.3s, color 0.3s;" class="text-blue-800 cursor-pointer font-bold">Enlace</button>
          <br>
          <li class="text-red-900 font-bold text-2xl">¡Diviértete chateando!</li> 
        </ol>
      `,
      customClass: {
        modal: "rounded-lg shadow-xxl",
        title: "text-center",
        imageUrl: "mx-auto mt-3",
        htmlContainer: "p-4",
        confirmButton:
          "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:shadow-outline-blue",
      },
      width: 500,
      padding: "2em",
      background: "#ffffff",
      didOpen: (modalElement) => {
        modalElement.querySelector("#enlace").addEventListener("click", () => {
          navigator.clipboard.writeText(
            "https://chat-socketio-n9to.onrender.com/"
          );
          setCopied(true);
          // Cambiar el texto del botón a "Copiado"
          modalElement.querySelector("#enlace").innerText = "Copiado";
          // Cambiar el color de fondo y del texto del botón a verde
          modalElement.querySelector("#enlace").style.backgroundColor = "#4CAF50";
          modalElement.querySelector("#enlace").style.color = "#ffffff";
        });
      },
    });
  }, []);

  return null;
};

export default Modal;
