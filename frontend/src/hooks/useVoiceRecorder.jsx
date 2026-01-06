import { useState, useRef, useEffect } from 'react';

const useVoiceRecorder = (onAudioSubmit) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
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
                    if (prev >= 60) { 
                         stopRecording(true); // Auto-send at 60s
                         return 60;
                    }
                    return prev + 1;
                });
            }, 1000);

        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("Could not access microphone. Please allow permissions.");
        }
    };

    const stopRecording = (shouldSend = true) => {
        if (mediaRecorderRef.current && isRecording) {
            
            // We need to define the onstop handler HERE to capture the 'shouldSend' closure logic
            // or we just handle the data processing manually here if the recorder is 'inactive'
            // But MediaRecorder is async.
            
            // Better approach: Assign a custom property or just handle the blob directly?
            // Standard approach: Assign different onstop handlers?
            
            mediaRecorderRef.current.onstop = () => {
                 const stream = mediaRecorderRef.current.stream;
                 if(stream) stream.getTracks().forEach(track => track.stop());

                 if (shouldSend) {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64Audio = reader.result;
                        onAudioSubmit(base64Audio);
                    };
                 }
            };
            
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const cancelRecording = () => {
        stopRecording(false);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return {
        isRecording,
        recordingTime,
        startRecording,
        stopRecording: () => stopRecording(true),
        cancelRecording,
        formatTime
    };
};

export default useVoiceRecorder;
