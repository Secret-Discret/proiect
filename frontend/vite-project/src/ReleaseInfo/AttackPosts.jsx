import { useState, useEffect } from "react";
import {useLocation, useNavigate} from "react-router-dom";
import attackVideo from "../assets/13164095_3840_2160_30fps.mp4";
import styles from "../styles/AttackStyles.module.css"
import partyVideo from "../assets/vecteezy_world-map-background-news-studio-background-for-news-report_30964613.mov";
import ufoVideo from "../assets/vecteezy_searching-documents-file-of-top-secret-in-drawer-in-dark_57045314.mp4";
import presidentVideo from "../assets/vecteezy_quantum-computer-futuristic-technology-digital-holographic_2709172.mp4";

const ATTACK_CONTENT = {
  release_party_photos: {
    title: "Party Photos Leaked 📸",
    message: "Embarrassing images have flooded the net.",
    video: partyVideo,
  },
  make_public_UFO_truth: {
    title: "UFO Truth Exposed 🛸",
    message: "Humanity can no longer deny the truth.",
    video: ufoVideo,
  },
  release_president_location: {
    title: "Presidential Location Compromised 🔎",
    message: "Real-time tracking data has been disclosed.",
    video: presidentVideo,
  },
};


function AttackPosts() {
  const [showPrompt, setShowPrompt] = useState(false);

  const { state } = useLocation();
  const navigate = useNavigate();

  const secretId = state?.secretId;

  const content =
      ATTACK_CONTENT[secretId] ?? {
      title: "Attack Successful",
      message: "The secret has been reconstructed.",
      video: attackVideo,
    };

  useEffect(() => {
    const handleKeyPress = () => {
      navigate("/second", { replace: true });
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate]);


  return (
    <div className={styles.container}>
      <video
          autoPlay
          playsInline
          className={styles.video}
          onEnded={() => setShowPrompt(true)}
      >
        <source src={content.video} type="video/mp4" />
      </video>

      <div className={styles.overlay}>
        <h2>{content.title}</h2>
        <p>{content.message}</p>

        {showPrompt && (
            <p className={styles.pressKey}>Press any key to continue...</p>
        )}
      </div>
    </div>
  );
}



export default AttackPosts;
