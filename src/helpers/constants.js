import Sound from "react-native-sound";

 
 export const playNotificationSound = () => {
        console.log("Attempting to play sound...");
        const sound = new Sound("notification.mp3", Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log("Sound loading error:", error);
                return;
            }
    
            sound.setVolume(1);
            sound.play((success) => {
                if (!success) {
                    console.log("Sound playback failed due to decoding errors.");
                }
                sound.release(); // Free memory after playing
            });
        });
    };