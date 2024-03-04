import Swal from "sweetalert2";

const TermsAndConditions = () => {
  const showTermsModal = () => {
    Swal.fire({
      title: "Terms and Conditions",
      html: `
         <div class="scrollable-content" style="height: 300px; overflow-y: auto; text-align: justify;">
  <h2 style="font-size: 1.2rem; font-family: Arial, sans-serif;">Terms and Conditions Agreement for Anonymous Mode in Flash Chat</h2>
  <br/>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>1. Statement of Intent</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">The Anonymous Mode in Flash Chat is provided with the purpose of protecting the identity of users and providing a level of anonymity while connected to the platform.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>2. Code of Conduct</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Users of the Anonymous Mode agree to use it responsibly and ethically. The use of the Anonymous Mode for illegal, defamatory, abusive, discriminatory activities, or activities that otherwise violate the rights of third parties is prohibited.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>3. Legal Compliance Notice</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Users of the Anonymous Mode must comply with all applicable local, national, and international laws and regulations. Violation of these laws may result in termination of access to the Anonymous Mode and the application of additional legal measures.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>4. Rights Reservation</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Flash Chat reserves the right to take appropriate measures in case of detecting misuse or abuse of the Anonymous Mode. These measures may include, among others, suspension or cancellation of the user's account.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>5. Information Disclosure</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Flash Chat may be required to disclose personal information of Anonymous Mode users in compliance with a court order or legal requirement.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>6. Limitation of Liability</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Flash Chat and Alemar16 will not be liable for any damage, loss, or harm that may result from the use of the Anonymous Mode, including but not limited to direct, indirect, incidental, special, or consequential damages.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>7. Jurisdiction and Applicable Law</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">This Agreement is governed by the laws of the Republic of Argentina, without regard to its conflict of laws provisions. Any dispute related to this Agreement shall be submitted to the exclusive jurisdiction of the courts of the Republic of Argentina.</p>

  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>8. Informed Consent</strong></p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">By activating the Anonymous Mode in Flash Chat, you agree to the terms and conditions set forth in this Agreement. If you do not agree to these terms, you must refrain from using the Anonymous Mode.</p>
  <br/>
  <h2 style="font-size: 1.2rem; font-family: Arial, sans-serif;">Purpose and Operation of Flash Chat</h2>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Flash Chat is an application designed to facilitate group or individual conversations among users. The peculiarity of Flash Chat lies in that no information is stored, including names, messages, text, videos, images, files, documents, audios, or audio notes.</p>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;">Upon disconnection, all records are automatically deleted and cannot be accessed, as there is no database that stores them. This ensures the privacy and confidentiality of user conversations.</p>
  <br/>
  <p style="font-size: 0.9rem; font-family: Arial, sans-serif;"><strong>Flash Chat is conceived as an alternative to existing chat applications, offering an efficient and secure communication experience without compromising user privacy.</strong></p>
</div>

      `,
      confirmButtonText: "Close",
    });
  };
  return (
    <div className="cursor-pointer hover:underline">
      <h6 onClick={showTermsModal}>Terms and Conditions</h6>
    </div>
  );
};

export default TermsAndConditions;
