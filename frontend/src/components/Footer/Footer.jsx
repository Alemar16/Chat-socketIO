function Footer() {
  return (
    <footer className="text-center sm:text-left">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-2 lg:py-2">
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-800 sm:text-center">
            © 2024{" "}
            <a
              href="https://github.com/Alemar16/Chat-socketIO#"
              target="_blank"
              rel="noopener noreferrer"
              title="Portfolio"
              className="hover:underline text-purple-800 font-bold hover:text-white"
            >
              Alemar16
            </a>
            . All Rights Reserved.
          </span>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
