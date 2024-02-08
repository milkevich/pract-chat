import React, { useState } from 'react';
import { useUserContext } from '../Contexts/UserContext';
import { Avatar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import CircleIcon from '@mui/icons-material/Circle';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import { LuMessageCircle } from "react-icons/lu";
import Divider from '@mui/material/Divider';
import { PiGear } from "react-icons/pi";
import { HiMiniAtSymbol } from "react-icons/hi2";
import { PiHashStraight } from "react-icons/pi";
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import { Link } from 'react-router-dom';



const Profile = () => {
    const [copied, setCopied] = useState(false)
    const { user, logOut } = useUserContext();

    const copyUserIdToClipboard = () => {
        setCopied(true)
        navigator.clipboard.writeText(user.uid);
        setTimeout(() => {
            setCopied(false)
        }, 5000)
    };

    return (
        <div style={styles.container}>
            <Snackbar
                open={copied}
                message="Copied!"
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                ContentProps={{
                    style: { backgroundColor: '#222222', color: '#ffffff', marginTop: "-10px", padding: "10px", paddingLeft: "20px", paddingRight: "0px", borderRadius: "15px" }
                }}
            />
            <div style={styles.section}>

                <div style={styles.userContainer}>

                <Avatar src={user.photoURL} sx={{ width: 46, height: 46, fontSize: 27 }} >
                    
                </Avatar>

                    <div style={styles.userContainer.info}>
                        <h1 style={styles.displayName}>{user.displayName}</h1>
                        <p><CircleIcon sx={{ width: 12, height: 12, color: "rgba(167, 255, 0, 1)" }} /> Online</p>
                    </div>

                </div>

                <div style={styles.userInfoContainer}>

                    <HiMiniAtSymbol style={{ marginTop: "5px" }} size={25} />

                    <div style={styles.infoSectionContainer}>
                        <p style={styles.infoSectionItem}>{user.email}</p>
                        <p style={styles.infoSectionItem.label}>Email</p>
                    </div>

                </div>
                <Tooltip title="Copy" placement="right">
                    <div style={styles.userInfoContainer} onClick={copyUserIdToClipboard}>


                        <PiHashStraight style={{ marginTop: "5px" }} size={25} />

                        <div style={styles.infoSectionContainer}>
                            <p style={styles.infoSectionItem}>{user.uid}</p>
                            <p style={styles.infoSectionItem.label}>User ID</p>
                        </div>

                    </div>
                </Tooltip>

                <Divider variant="middle" />

                <Link to={'/pract-chat/chat'} style={styles.userInfoContainer}>

                    <LuMessageCircle style={{ marginTop: "5px" }} size={20} />

                    <div style={styles.infoSectionContainer}>
                        <p style={styles.infoSectionItem}>Messages</p>
                    </div>

                </Link>

                <Link to={'/pract-chat/settings'} style={styles.userInfoContainer}>

                    <PiGear style={{ marginTop: "5px" }} size={24} />

                    <div style={styles.infoSectionContainer}>
                        <p style={styles.infoSectionItem}>Settings</p>
                    </div>

                </Link>

                <div style={styles.bottom}>

                    <div style={styles.warningContainer}>

                        <ErrorRoundedIcon sx={{ fontSize: "30px" }} />

                        <div style={styles.warningContainer.info}>
                            <p style={styles.warningContainer.info.item}>This is a practice project, let's keep it appropriate</p>
                        </div>

                    </div>

                    <button style={styles.logOutBtn} onClick={logOut}><LogoutIcon sx={{ color: "white", fontSize: "21px", position: "absolute", left: "20px", top: "13px" }} /> Log Out</button>

                </div>

            </div>
        </div>
    );
};

export default Profile;

const styles = {
    container: {
        display: 'flex',
        alignItems: 'flex-start',
        paddingLeft: '20px',
        paddingTop: '20px',
        color: "#222222",
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "260px",
        height: "95vh",
        paddingRight: "45px",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
    },
    userContainer: {
        display: 'flex',
        alignItems: 'center',
        info: {
            marginLeft: "20px"
        }
    },
    displayName: {
        textAlign: "left",
        fontSize: "21px",
        marginBottom: "-15px"
    },
    userInfoContainer: {
        display: 'flex',
        alignItems: 'center',
        textDecoration: "none",
        color: "#222222"
    },
    infoSectionContainer: {
        marginLeft: '10px',
        cursor: "pointer",
        width: "100%",
        marginTop: "5px",
    },
    infoSectionItem: {
        fontWeight: "600",
        maxWidth: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        label: {
            color: "#6B6B6B",
            marginTop: "-10px"
        }
    },
    bottom: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "260px",
        position: "absolute",
        bottom: "10px"
    },
    warningContainer: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: "15px",
        paddingRight: "15px",
        borderRadius: "15px",
        marginBottom: "10px",
        backgroundImage: "linear-gradient(100.72deg, #A3FEB9 7.96%, #FAEF5C 88.59%)",
        info: {
            marginLeft: "10px"
        }
    },
    logOutBtn: {
        padding: "15px",
        backgroundColor: "#222222",
        border: "none",
        outline: "none",
        borderRadius: "15px",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        position: "relative"
    }
};
