import { useEffect } from "react";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const Modal = () => {
  const { t, i18n } = useTranslation();

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
        <div style="position: absolute; top: 10px; right: 10px;">
           <button id="lang-toggle" style="display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: bold; cursor: pointer; padding: 6px 10px; border-radius: 20px; border: 1px solid #ddd; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: all 0.2s;">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="width: 14px; height: 14px; color: #852CA5;">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              ${i18n.language === 'en' ? 'ES' : 'EN'}
           </button>
        </div>
        <p style="color: black;"><strong>${t('modal.howToUse')}</strong></p><br>
        <ol>
          <li style="color: black;">${t('modal.step1', { login: t('login.login'), anonymous: t('login.anonymous') })}</li>
          <br>
          <li style="color: black;">${t('modal.step2')}</li>
          <br>
          <button id="enlace" style="background-color: #ffffff; border: 1px solid #3182ce; color: #3182ce; padding: 8px 16px; font-size: 16px; font-weight: bold; cursor: pointer; border-radius: 4px; transition: background-color 0.3s, color 0.3s;" class="text-blue-800 cursor-pointer font-bold">${t('modal.linkBtn')}</button>
          <br>
          <br>
           <li style="color: black;">${t('modal.step3')}</li>
           <div style="display: flex; gap: 5px; justify-content: center; margin-top: 5px;">
             <input id="join-room-input" type="text" placeholder="${t('modal.joinPlaceholder')}" style="border: 1px solid #ccc; padding: 8px; border-radius: 4px; width: 60%; color: black;" />
             <button id="join-btn" style="background-color: #4CCFF1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;">${t('modal.joinBtn')}</button>
           </div>
          <br>
          <li class="text-red-900 font-bold text-3xl"><span style="color: #4CCFF1; text-shadow: 2px 2px 4px #000; font-family: Boogaloo, cursive;">${t('modal.start')}</span></li> 
         
        </ol>
      `,
      customClass: {
        popup: "rounded-lg shadow-xxl bg-white/95 backdrop-blur-md",
        title: "text-center text-5xl mt-[-4rem] whitespace-nowrap",
        imageUrl: "mx-auto mt-3",
        htmlContainer: "p-4",
        confirmButton:
        "bg-purple-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-purple-800 focus:outline-none focus:shadow-outline-blue",
      },
      width: 500,
      padding: "0.5em", 

      didOpen: (modalElement) => {
        // Language Switcher Logic
        modalElement.querySelector("#lang-toggle").addEventListener("click", () => {
             const newLang = i18n.language === 'en' ? 'es' : 'en';
             i18n.changeLanguage(newLang);
        });

        // Enlace copy logic
        modalElement.querySelector("#enlace").addEventListener("click", () => {
          navigator.clipboard.writeText(window.location.href);

          // Change button text to "Copied"
          const enlaceBtn = modalElement.querySelector("#enlace");
          enlaceBtn.innerText = t('modal.copied');
          // Change button background and text color to green
          enlaceBtn.style.backgroundColor = "#4CAF50";
          enlaceBtn.style.color = "#ffffff";
        });

        // Join room logic
        const joinBtn = modalElement.querySelector("#join-btn");
        const joinInput = modalElement.querySelector("#join-room-input");

        joinBtn.addEventListener("click", () => {
          const inputVal = joinInput.value.trim();
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

    return () => {
        // Cleanup to prevent duplicate modals if effect re-runs (though usually Swal manages itself, explicit close ensures update)
        // Check if modal is visible to avoid closing if it was already closed by user
        if (Swal.isVisible()) {
            Swal.close();
        }
    };
  }, [t, i18n, i18n.language]);

  return null;
};

export default Modal;
