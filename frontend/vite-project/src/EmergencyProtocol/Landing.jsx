import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CoalitionSlots from "./CoalitionSlots";
import UserList from "./UserList";
import nuclearGif from "../assets/nuclear_symbol2.gif";
import TitleCard from "./TitleCard.jsx";

export default function EmergencyLanding() {
    const [users, setUsers] = useState([]);
    const [coalition, setCoalition] = useState([]);
    const [threshold, setThreshold] = useState(0);
    const [showTitle, setShowTitle] = useState(false);

    // useEffect(() => {
    //     const seen = localStorage.getItem("scenarioSeen");
    //     if (!seen) {
    //     setShowTitle(true);
    //     }
    // }, []);

    useEffect(() => {
        setShowTitle(true);
    }, []);

    //fetch scenario and users from backend
    useEffect(() => {
        const startScenario = async () => {
            try {
                const res = await fetch("http://localhost:8000/hierarchical/start", {
                method: "POST"
                });
                const data = await res.json();

                setUsers(
                data.users.map(u => ({
                    ...u,
                    available: u.availability
                }))
                );
                setThreshold(data.threshold);
                setCoalition([]);
            } catch (err) {
                console.error("Failed to start scenario:", err);
            };
        };

        startScenario();
    }, []);

    const addToCoalition = (user) => {
        if (!user.available) return;
        if (coalition.length >= threshold) return;

        setCoalition(prev => [...prev, user]);
        setUsers(prev =>
        prev.map(u =>
            u.id === user.id ? { ...u, available: false } : u
        )
        );
    };

    const removeFromCoalition = (user) => {
        setCoalition(prev => prev.filter(u => u.id !== user.id));
        setUsers(prev =>
        prev.map(u =>
            u.id === user.id ? { ...u, available: true } : u
        )
        );
    };

//confirm coalition
    const totalWeight = coalition.reduce((sum, u) => sum + u.weight, 0);
    const coalitionValid = totalWeight >= threshold;
    const navigate = useNavigate();

    const confirmCoalition = () => {
        if (!coalitionValid) return;

        navigate("/emergency/math", {
            state: {
            coalition,
            threshold
            }
        });
    };

//clear localstorage in chrome: Inspect -> Application -> Storage -> Local Storage -> clear
    const dismissTitle = () => {
        localStorage.setItem("scenarioSeen", "true");
        setShowTitle(false);
    };

    if (showTitle) {
        return <TitleCard onDismiss={dismissTitle} />;
    }

    return (
        <div>
            <div style={styles.container}>
                <div style={styles.titleSection}>
                    <img src={nuclearGif} style={styles.img} />
                    <div>
                        <h1 style={styles.title}>Emergency Override Authorization</h1>
                        <p style={styles.subtitle}>Central authority unavailable. Assemble a coalition to unlock emergency systems.</p>
                    </div>
                    <img src={nuclearGif} style={styles.img} />
                </div>

                <CoalitionSlots
                    coalition={coalition}
                    removeFromCoalition={removeFromCoalition}
                />

                <button
                    onClick={confirmCoalition}
                    disabled={!coalitionValid}
                    style={{
                        ...styles.confirmButton,
                        ...(coalitionValid
                        ? styles.confirmEnabled
                        : styles.confirmDisabled)
                    }}
                >
                    Confirm Coalition
                </button>

                <UserList
                    users={users}
                    addToCoalition={addToCoalition}
                />
            </div>
        </div>
    );
}

const styles = {
    container: {
        maxHeight: "100vh",
        minHeight: "666px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: "5px 15px",
        backgroundColor: "#000000",
        fontFamily: "'Courier New', Courier, monospace",
        color: "#00ff00",
    },
    title: {
        textAlign: "center",
        fontSize: "24px",
        fontWeight: "bold",
        marginBottom: "4px",
    },
    subtitle: {
        textAlign: "center",
        marginBottom: "5px"
    },
    titleSection: {
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "10px"
    },
    img: {
        width: "60px",
    },
    confirmButton: {
        width: "300px",
        margin: "0 auto",
        padding: "12px 24px",
        border: "2px solid #00ff00",
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: "16px"
    },
    confirmEnabled: {
        backgroundColor: "#000000",
        color: "#ff0000",
        cursor: "pointer"
    },
    confirmDisabled: {
        backgroundColor: "#000000",
        cursor: "not-allowed",
        color: "#00ff00",
        opacity: 0.5
    }
};