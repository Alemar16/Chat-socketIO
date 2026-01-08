import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, CameraIcon, ArrowPathIcon, CheckIcon, ArrowsRightLeftIcon } from "@heroicons/react/24/solid";

const CameraModal = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState('');
    const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'

    const stopCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setCapturedImage(null);
    }, []);

    const startCamera = useCallback(async () => {
        try {
            stopCamera(); // Stop previous stream so we can start new one
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: facingMode } 
            });
            streamRef.current = mediaStream;
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("Could not access camera. Please ensure permissions are granted.");
        }
    }, [facingMode, stopCamera]); // Re-run when mode changes

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => {
            stopCamera();
        };
    }, [isOpen, startCamera, stopCamera, facingMode]); // Depend on facingMode indirectly via startCamera

    const toggleCamera = () => {
        setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            
            // Set canvas dimensions to match video
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            const imageDataUrl = canvas.toDataURL('image/png');
            setCapturedImage(imageDataUrl);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    const handleConfirm = () => {
        if (capturedImage) {
            // Calculate approximate size from Base64
            const stringLength = capturedImage.length - 'data:image/png;base64,'.length;
            const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
            const fileSizeKB = (sizeInBytes / 1024).toFixed(2) + " KB";
            
            const metadata = {
                name: `cam_${new Date().toISOString().replace(/[:.]/g, '-')}.png`,
                size: fileSizeKB,
                type: 'image/png'
            };

            onCapture(capturedImage, metadata);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden flex flex-col relative">
                
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">Take Photo</h3>
                    <button 
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="relative w-full bg-black aspect-video flex items-center justify-center overflow-hidden">
                    {error ? (
                        <div className="text-white text-center p-4">
                            <p className="mb-2">📷</p>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            {!capturedImage ? (
                                <video 
                                    ref={videoRef} 
                                    autoPlay 
                                    playsInline 
                                    muted 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <img 
                                    src={capturedImage} 
                                    alt="Captured" 
                                    className="w-full h-full object-contain" 
                                />
                            )}
                        </>
                    )}
                    {/* Hidden Canvas for Capture */}
                    <canvas ref={canvasRef} className="hidden" />

                    {/* Switch Camera Button (Overlay) */}
                    {!capturedImage && !error && (
                        <button 
                            onClick={toggleCamera}
                            className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 backdrop-blur-sm transition-all"
                            title="Switch Camera"
                        >
                            <ArrowsRightLeftIcon className="w-6 h-6" />
                        </button>
                    )}
                </div>

                {/* Footer / Controls */}
                <div className="p-4 flex justify-center items-center gap-4 bg-gray-50 dark:bg-gray-900 border-t dark:border-gray-700">
                    {!capturedImage ? (
                        <button 
                            onClick={handleCapture}
                            disabled={!!error}
                            className={`w-14 h-14 rounded-full border-4 border-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 ${error ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                        >
                            <CameraIcon className="w-8 h-8 text-white" />
                        </button>
                    ) : (
                        <>
                            <button 
                                onClick={handleRetake}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ArrowPathIcon className="w-5 h-5" />
                                Retake
                            </button>
                            <button 
                                onClick={handleConfirm}
                                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <CheckIcon className="w-5 h-5" />
                                Use Photo
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

CameraModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onCapture: PropTypes.func.isRequired,
};

export default CameraModal;
