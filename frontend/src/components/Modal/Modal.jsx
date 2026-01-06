import { useEffect } from "react";
import Swal from "sweetalert2";



const Modal = () => {

  useEffect(() => {
    // Check if we should skip the modal (e.g. user just joined a room via the modal)
    if (sessionStorage.getItem("skip_welcome_modal")) {
      setTimeout(() => {
        sessionStorage.removeItem("skip_welcome_modal");
      }, 2000);
      return;
    }

    Swal.fire({
      title:
      '<span style="color: #852CA5; text-shadow: 2px 2px 4px #000; font-family: Boogaloo, cursive;">Flash</span><span style="color: #4CCFF1;text-shadow: 2px 2px 4px #000; font-family: Boogaloo, cursive;">Chat</span>',
      imageUrl: "/icons8-chat-100.png",
      html: `
        <p style="color: black;"><strong>How to Use:</strong></p><br>
        <ol>
          <li style="color: black;">Enter your name and click "<span class="font-bold">Login</span>"<br> or <br> "Enter as <span class="font-bold">Anonymous</span>".</li>
          <br>
          <li style="color: black;">Share this link:</li>
          <br>
          <button id="enlace" style="background-color: #ffffff; border: 1px solid #3182ce; color: #3182ce; padding: 8px 16px; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 4px; transition: background-color 0.3s, color 0.3s;" class="text-blue-800 cursor-pointer font-bold">Link</button>
          <br>
          <br>
           <li style="color: black;">Or join a room:</li>
           <div style="display: flex; gap: 5px; justify-content: center; margin-top: 5px;">
             <input id="join-room-input" type="text" placeholder="Paste link or Room ID" style="border: 1px solid #ccc; padding: 8px; border-radius: 4px; width: 60%; color: black;" />
             <button id="join-btn" style="background-color: #4CCFF1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">Join</button>
           </div>
          <br>
          <li class="text-red-900 font-bold text-3xl"><span style="color: #4CCFF1; text-shadow: 2px 2px 4px #000; font-family: Boogaloo, cursive;">Start<BR> Chatting and Enjoy!</span></li> 
         
        </ol>
      `,
      customClass: {
        modal: "rounded-lg shadow-xxl",
        title: "text-center text-5xl mt-[-4rem] whitespace-nowrap",
        imageUrl: "mx-auto mt-3",
        htmlContainer: "p-4",
        confirmButton:
        "bg-purple-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:shadow-outline-blue",
      },
      width: 500,
      padding: "0.5em",
      background: "rgba(180, 180, 180, 0.7)", 

      didOpen: (modalElement) => {
        // Enlace copy logic
        modalElement.querySelector("#enlace").addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.href);

          // Change button text to "Copied"
          const enlaceBtn = modalElement.querySelector("#enlace");
          enlaceBtn.innerText = "Copied";
          // Change button background and text color to green
          enlaceBtn.style.backgroundColor = "#4CAF50";
          enlaceBtn.style.color = "#ffffff";
        });

        // Join room logic
        modalElement.querySelector("#join-btn").addEventListener("click", () => {
          const inputVal = modalElement.querySelector("#join-room-input").value.trim();
          if (!inputVal) return;

          let roomId;
          try {
            const url = new URL(inputVal);
            roomId = url.searchParams.get("room");
          } catch (e) {
            // If not a URL, assume it's the room ID itself
            roomId = inputVal;
          }

          if (roomId) {
            sessionStorage.setItem("skip_welcome_modal", "true");
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?room=' + roomId;
            window.location.href = newUrl;
          }
        });
      },
    });
  }, []);

  return null;
};

export default Modal;
