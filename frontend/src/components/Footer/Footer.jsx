function Footer() {
    return (
        <footer class="text-center sm:text-left">
            <div class="mx-auto w-full max-w-screen-xl p-4 py-2 lg:py-2">
                <div class="sm:flex sm:items-center sm:justify-between">
                    <span class="text-sm text-gray-800 sm:text-center">© 2024 <a href="https://portfolio-am-tau.vercel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Portfolio"
                        class="hover:underline text-purple-800 font-bold hover:text-white"
                    >Alemar16</a>. All Rights Reserved.
                    </span>
                    <div class="flex justify-center mt-4 sm:justify-center sm:mt-0">
                        {/* Twitter */}
                        <a href="https://twitter.com/TheArmandoMarti"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Twitter"
                            class="text-purple-800 hover:text-white ms-5">
                            <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                <path fill-rule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Twitter page</span>
                        </a>
                        {/* Github */}
                        <a
                            href="https://github.com/Alemar16"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="GitHub"
                            class="text-purple-800 hover:text-white ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd" />
                            </svg>
                            <span className="sr-only">GitHub account</span>
                        </a>
                        {/* Linkedin */}
                        <a href="https://www.linkedin.com/in/armando-mart%C3%ADnez-zambrano/"
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Linkedin"
                            class="text-purple-800 hover:text-white ms-5">
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M17.5 0h-15C1.121 0 0 1.121 0 2.5v15c0 1.379 1.121 2.5 2.5 2.5h15c1.379 0 2.5-1.121 2.5-2.5v-15C20 1.121 18.879 0 17.5 0zM8.75 17.5h-5c-0.137 0-0.25-0.113-0.25-0.25v-9c0-0.137 0.113-0.25 0.25-0.25h5c0.137 0 0.25 0.113 0.25 0.25v9C9 17.387 8.887 17.5 8.75 17.5zM19 5h-3v10h3c0.551 0 1-0.449 1-1V6C20 5.449 19.551 5 19 5zM14 3h-3v12h3v-12zM11 5H8C7.449 5 7 5.449 7 6v9c0 0.551 0.449 1 1 1h3c0.551 0 1-0.449 1-1V6C12 5.449 11.551 5 11 5z"></path>
                            </svg>
                            <span className="sr-only">LinkedIn account</span>
                        </a>
                    </div>
                </div>
            </div>
        </footer>

    )
}

export default Footer