import Swal from 'sweetalert2';

export const ButtonShare = () => {
  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: 'Join my Private FlashChat!',
      text: 'Click to join my private, ephemeral chat room.',
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        Swal.fire({
          icon: 'success',
          title: 'Link Copied!',
          text: 'Share it with your friends to invite them.',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Could not copy link.',
        });
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-3 rounded shadow-md transition-colors duration-200 text-sm flex items-center gap-2"
      title="Share Chat Link"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
      </svg>
      Share
    </button>
  );
};
