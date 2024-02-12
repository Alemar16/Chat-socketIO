import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const Modal = () => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const modal = Swal.fire({
      title:
        'Welcome to <br> <span class="text-blue-800">Flash</span><span class="text-purple-500">Chat</span>',
      titleStyle: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#000000",
      },
      imageUrl: "/icons8-chat-100.png",
      html: `
        <p><strong>How to Use:</strong></p><br>
        <ol>
          <li>Enter your name and click "<span class="font-bold">Login</span>"<br> or <br> "Enter as <span class="font-bold">Anonymous</span>".</li>
          <br>
          <li>Share this link:</li>
          <br>
          <button id="enlace" style="background-color: #ffffff; border: 1px solid #3182ce; color: #3182ce; padding: 8px 16px; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 4px; transition: background-color 0.3s, color 0.3s;" class="text-blue-800 cursor-pointer font-bold">Link</button>
          <br>
          <li class="text-red-900 font-bold text-2xl">Start Chatting and Enjoy!</li> 
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
      padding: "1em",
      background: "#fe9393",
      didOpen: (modalElement) => {
        modalElement.querySelector("#enlace").addEventListener("click", () => {
          navigator.clipboard.writeText(
            "https://chat-socketio-n9to.onrender.com/"
          );
          setCopied(true);
          // Change button text to "Copied"
          modalElement.querySelector("#enlace").innerText = "Copied";
          // Change button background and text color to green
          modalElement.querySelector("#enlace").style.backgroundColor = "#4CAF50";
          modalElement.querySelector("#enlace").style.color = "#ffffff";
        });
      },
    });
  }, []);

  return null;
};

export default Modal;
