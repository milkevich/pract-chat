import React, { useEffect, useState } from 'react';
import { useUserContext } from '../Contexts/UserContext';
import { Avatar, Fade } from '@mui/material';
import Divider from '@mui/material/Divider';
import { HiOutlineSearch } from "react-icons/hi";
import { db } from '../firebaseConfig';
import { doc, collection, query, where, getDoc, getDocs, updateDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/database';
import { useChatContext } from '../Contexts/ChatContext';
import ChatForm from './ChatForm';
import NoChatsImage from '../imgs/NoChats.png';




const Messages = () => {
    const [username, setUsername] = useState('');
    const [otherUser, setOtherUser] = useState(null);
    const { user } = useUserContext();
    const { dispatch } = useChatContext();
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        const getChats = () => {
            const unsub = onSnapshot(doc(db, "userChats", user.uid), (doc) => {
                setChats(doc.data());
            });

            return () => {
                unsub();
            };
        };

        user.uid && getChats();
    }, [user.uid]);



    const handleSearch = async () => {
        if (username.trim() !== '') {
            const q = query(
                collection(db, "users"),
                where("uid", "==", username.trim())
            );

            try {
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs.map(doc => doc.data());
                    setOtherUser(userData);
                    console.log("user found " + username);
                } else {
                    setOtherUser(null);
                    console.log('no user');
                }
            } catch (error) {
                console.error('Error searching user:', error);
            }
        }
    };

    const handleKey = (e) => {
        e.code === "Enter" && handleSearch();
        setUsername(null)
    };

    const handleSelect = async () => {
        if (otherUser && otherUser.length > 0) {
            const otherUserData = otherUser[0];
            const combinedId = user.uid > otherUserData.uid
                ? user.uid + otherUserData.uid
                : otherUserData.uid + user.uid;

            try {
                const chatRef = doc(db, "chats", combinedId);
                const chatSnapshot = await getDoc(chatRef);

                if (!chatSnapshot.exists()) {
                    await setDoc(chatRef, { messages: [] });
                }

                const updateUserChats = async (uid, userData) => {
                    const userChatRef = doc(db, "userChats", uid);
                    const userChatSnapshot = await getDoc(userChatRef);

                    if (!userChatSnapshot.exists()) {
                        await setDoc(userChatRef, {});
                    }

                    await updateDoc(doc(db, "userChats", uid), {
                        [combinedId + ".userInfo"]: {
                            uid: userData.uid,
                            displayName: userData.displayName,
                            email: userData.email,
                            photoURL: userData.photoURL,
                        },
                        [combinedId + ".date"]: serverTimestamp(),
                    });
                };

                setOtherUser(null)
                setUsername('')

                await updateUserChats(otherUserData.uid, user);
                await updateUserChats(user.uid, otherUserData);

            } catch (error) {
                console.error('Error selecting chat:', error);
            }
        }
    };

    const handleEnterChat = (userInfo) => {
        dispatch({ type: "CHANGE_USER", payload: userInfo });
        setSelectedChat(userInfo);
    };

    const formatTimestamp = (timestamp) => {
        if (timestamp && timestamp.toDate) {
            const date = timestamp.toDate();
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const time = `${formattedHours}:${formattedMinutes} ${ampm}`;
            return time.toString();
        } else {
            return '';
        }
    };


    return (
        <div style={styles.container}>
            <section style={styles.section}>
                <div style={styles.searchContainer}>
                    <HiOutlineSearch style={styles.searchBtn} />
                    <input onKeyDown={handleKey} value={username} onChange={e => setUsername(e.target.value)} placeholder='Search' style={styles.search} type="text" />
                </div>
                {username !== '' && (
                    <div style={{textAlign: "start", marginLeft: "20px", color: 'grey' }}>Please enter user's exact ID <br /> and then press Enter to find a user</div>
                )}
                {otherUser && (
                    <div>
                        <div onClick={handleSelect} style={styles.messageContainer}>
                            <Avatar src={otherUser[0].photoURL} sx={{ width: 46, height: 46, fontSize: 27 }}></Avatar>
                            <div style={styles.messageContainer.infoContainer}>
                                <h1 style={styles.displayName}>{otherUser[0].displayName}</h1>
                                <p style={styles.lastMessage}>Click to chat</p>
                            </div>
                        </div>
                        <Divider variant="middle" />
                    </div>
                )}
                {username === '' && chats && Object.entries(chats)?.sort((a, b) => b[1].date - a[1].date).map((chat, index) => (
                    <Fade in={true} style={{ transitionDelay: `${index * 200}ms` }}>
                        <div key={chat[0]} onClick={() => handleEnterChat(chat[1].userInfo)}>
                            <div onClick={handleSelect} style={{
                                ...styles.messageContainer,
                                backgroundColor: selectedChat && chat[1].userInfo.uid === selectedChat.uid ? "rgba(167, 255, 0, 0.3)" : "white",
                                borderLeft: selectedChat && chat[1].userInfo.uid === selectedChat.uid ? "3px solid rgba(167, 255, 0, 1)" : "3px solid rgba(167, 255, 0, 0)"
                            }}>
                                <Avatar src={chat[1].userInfo.photoURL} sx={{ width: 46, height: 46, fontSize: 27 }}></Avatar>
                                <div style={styles.messageContainer.infoContainer}>
                                    <h1 style={styles.displayName}>
                                        {chat[1].userInfo.displayName}
                                        <span style={styles.lastMessage.date}>
                                            {chat[1].lastMessage ? formatTimestamp(chat[1].date) : ''}
                                        </span>
                                    </h1>
                                    <div style={styles.LastMessageContainer}>
                                        {chat[1].lastMessage && chat[1].lastMessage.text ? (
                                            <p style={styles.lastMessage}>
                                                {chat[1].lastMessage.text}
                                            </p>
                                        ) : (
                                            <p style={styles.lastMessage}>
                                                {chat[1].lastMessage && chat[1].lastMessage.type !== 'text' ? 'File sent' : 'Click to chat'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <Divider variant="middle" />
                        </div>
                    </Fade>
                ))}
            </section>
            {selectedChat ? (
                <ChatForm />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
                    <h1>You have no active chats yet.</h1>
                    <p style={{ marginTop: "-15px" }}>Find a friend and start the dialog!</p>
                    <img style={styles.NoChats} src={NoChatsImage} alt="No chats" />
                </div>
            )}
        </div>
    );
    
    
};

export default Messages;

const styles = {
    container: {
        display: 'flex',
        color: "#222222",
    },
    section: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: "400px",
        minWidth: "300px",
        height: "100vh",
        borderRight: "1px solid rgba(0, 0, 0, 0.12)",
        overflow: "hidden",
        overflowY: "auto",
        scrollbarWidth: "none",
        '&::-webkit-scrollbar': {
            display: "none",
        },
    },
    searchContainer: {
        display: 'flex',
        position: "sticky",
        top: "0",
        backgroundColor: "white",
        paddingBottom: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px",
        zIndex: 2
    },
    search: {
        height: "32px",
        border: "1px solid #d6d6d6",
        borderRadius: "10px",
        paddingLeft: "10px",
        color: "#222222",
        marginLeft: "10px",
        width: "80%"
    },
    searchBtn: {
        height: "18px",
        width: "18px",
        border: "1px solid #d6d6d6",
        borderRadius: "10px",
        padding: "8px",
        cursor: "pointer"
    },
    messageContainer: {
        display: 'flex',
        cursor: "pointer",
        paddingTop: "20px",
        paddingBottom: "10px",
        paddingLeft: "20px",
        paddingRight: "20px",
        infoContainer: {
            marginLeft: "20px"
        },
    },
    displayName: {
        fontSize: "16px",
        marginBottom: "-15px",
        marginTop: "0px",
        maxWidth: "190px",
        minWidth: "190px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
    },
    LastMessageContainer: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "200px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        color: "#6B6B6B",
        position: "relative"
    },
    lastMessage: {
        flex: "1",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        fontWeight: "400",
        date: {
            marginLeft: "10px",
            color: "black",
            fontSize: "12px",
            fontWeight: "400",
            float: "right"
        }
    },
    NoChats: {
        maxWidth: "70%",
        marginTop: "50px"
    }
}
