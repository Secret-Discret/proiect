import { Link, useLocation } from "react-router-dom";

function Header() {
    const location = useLocation();

    const links = [
        { path: "/", label: "Weighted Secret Sharing" },
        { path: "/second", label: "Multi Secret Sharing" },
        { path: "/simple", label: "Simple Secret Sharing" },
        { path: "/emergency", label: "Hierarchical Secret Sharing"},
    ];

    return (
        <header style={styles.header}>
            {links.map(({ path, label }) => (
                <Link
                    key={path}
                    to={path}
                    style={{
                        ...styles.link,
                        ...(location.pathname === path ? styles.linkActive : {}),
                    }}
                >
                    {label}
                </Link>
            ))}
        </header>
    );
}

const styles = {
    header: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "50px",
        backgroundColor: "black",
        color: "#00ff00",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        borderBottom: "1px solid #00ff00",
        zIndex: 1000,
        fontFamily: "'Courier New', monospace",
    },
    link: {
        color: "#00ff00",
        textDecoration: "none",
        cursor: "pointer",
        padding: "5px 10px",
        borderRadius: "4px",
    },
    linkActive: {
        backgroundColor: "#00ff00",
        color: "black",
    }

};

export default Header;
