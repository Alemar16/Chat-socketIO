import { useState, useRef, useEffect } from 'react';

const useVoiceRecorder = (propsOrCallback) => {
    // Support legacy callback or new options object
    const options = typeof propsOrCallback === 'function' ? { onAudioSubmit: propsOrCallback } : propsOrCallback;
    const { onAudioSubmit, onLimitReached } = options;

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [recordedAudio, setRecordedAudio] = useState(null); // New state for saved audio
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorder.onstop = () => {
                 // Stop all tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            
            // Start Timer
            setRecordingTime(0);
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => {
                    if (prev >= 120) { // 2 Minutes Limit
                         // Prevent multiple calls
                         if (timerRef.current) {
                             clearInterval(timerRef.current);
                             timerRef.current = null;
                         }
                         stopRecording({ send: false, save: true }); // Stop and Save
                         if (onLimitReached) onLimitReached();
                         return 120;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = (options = { send: true, save: false }) => {
        // Handle legacy boolean argument (shouldSend)
        const shouldSend = typeof options === 'boolean' ? options : (options.send ?? true);
        const shouldSave = typeof options === 'object' ? (options.save ?? false) : false;

        if (mediaRecorderRef.current && isRecording) {
            
            mediaRecorderRef.current.onstop = () => {
                 const stream = mediaRecorderRef.current.stream;
                 if(stream) stream.getTracks().forEach(track => track.stop());

                 if (shouldSend || shouldSave) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64Audio = reader.result;
                        if (shouldSend) {
                            onAudioSubmit(base64Audio);
                        }
                        if (shouldSave) {
                            setRecordedAudio(base64Audio);
                        }
                    };
                 }
            };
            
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const cancelRecording = () => {
        stopRecording({ send: false, save: false });
        setRecordedAudio(null);
    };

    const clearRecordedAudio = () => {
        setRecordedAudio(null);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return {
        isRecording,
        recordingTime,
        recordedAudio,
        startRecording,
        stopRecording: () => stopRecording({ send: true }), // Default btn behavior
        cancelRecording,
        clearRecordedAudio,
        formatTime,
        sendRecordedAudio: () => {
             if (recordedAudio && onAudioSubmit) {
                 onAudioSubmit(recordedAudio);
                 setRecordedAudio(null);
             }
        }
    };
};

export default useVoiceRecorder;
