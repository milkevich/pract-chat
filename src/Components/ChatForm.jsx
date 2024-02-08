import React, { useEffect, useState, useRef } from 'react';
import { Avatar } from '@mui/material';
import { FiPaperclip } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { useChatContext } from '../Contexts/ChatContext';
import { Timestamp, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useUserContext } from '../Contexts/UserContext';
import { v4 as uuid } from 'uuid';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import LinearProgress from '@mui/material/LinearProgress';
import noMessages from '../imgs/chatImgNoMessages.png'


const ChatForm = () => {
    const { data } = useChatContext();
    const { user } = useUserContext();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [img, setImg] = useState(null);
    const messagesEndRef = useRef(null);
    const [progressPrecent, setProgressPrecent] = useState(null)


    const storage = getStorage();

    useEffect(() => {
        if (data.chatId) {
            const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
                if (doc.exists()) {
                    const chatData = doc.data();
                    setMessages(chatData.messages);
                }
            });

            return () => {
                unSub();
            };
        }
    }, [data.chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async () => {
        if (text.trim() || img) {
            if (img) {
                const storageRef = ref(storage, `images/${uuid()}`);
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log("Upload is " + progress + "% done");
                        setProgressPrecent(progress)
                    },
                    (error) => {
                        console.error("Upload error:", error);
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                            await updateDoc(doc(db, "chats", data.chatId), {
                                messages: arrayUnion({
                                    id: uuid(),
                                    senderId: user.uid,
                                    date: Timestamp.now(),
                                    img: downloadURL,
                                }),
                            });
                            setProgressPrecent(null)
                            setImg(null)
                        });
                    }
                );
            } else {
                await updateDoc(doc(db, "chats", data.chatId), {
                    messages: arrayUnion({
                        id: uuid(),
                        text,
                        senderId: user.uid,
                        date: Timestamp.now(),
                    }),
                });
                setText('')
            }
        }

        await updateDoc(doc(db, "userChats", user.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: Timestamp.now(),
        });

        await updateDoc(doc(db, "userChats", data.otherUser.uid), {
            [data.chatId + ".lastMessage"]: {
                text,
            },
            [data.chatId + ".date"]: Timestamp.now(),
        });

        setText("");
        setImg(null);
    };

    console.log(storage);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setImg(file);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
    };

    console.log(data)


    const firstInitial = data && data.otherUser && data.otherUser.displayName ? data.otherUser.displayName[0].toUpperCase() : '';

    return (
        <div style={styles.container}>
            <div style={styles.userInfoContainer}>
                <Avatar src={data.otherUser.photoURL}></Avatar>
                <div style={styles.userInfo}>
                    <h1 style={styles.displayName}>{data.otherUser.displayName}</h1>
                    <p style={styles.email}>{data.otherUser.email}</p>
                </div>
            </div>
            {messages.length === 0 ? (
                <div style={styles.noMessagesContainer}>
                    <h1>Looks like it's nothing here.</h1>
                    <p style={{ marginTop: "-15px" }}>Send a message to start chhatting!</p>
                    <img style={styles.noMessagesContainer.img} src={noMessages} alt="" />
                </div>
            ) : (
                <div style={styles.messagesContainer}>
                    {messages.map((message) => (
                        <React.Fragment key={message.id}>
                            {message.text && (
                                <div
                                    style={{
                                        ...styles.messagesContainer.message,
                                        ...(message.senderId === user.uid ? styles.ownMessage : styles.otherMessage),
                                    }}
                                >
                                    <p>{message.text}<span style={{ marginLeft: "10px", fontSize: "11px" }}>{formatTimestamp(message.date)}</span></p>
                                </div>
                            )}
                            {message.img && (
                                <div
                                    style={{
                                        ...styles.messagesContainer.imMessage,
                                        ...(message.senderId === user.uid ? styles.ownImgMessage : styles.otherImgMessage),
                                    }}
                                >
                                    <img style={styles.img} src={message.img} alt="Attached" />
                                    <span style={{ marginLeft: "10px", marginTop: "10px", fontSize: "11px" }}>{formatTimestamp(message.date)}</span>
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            )}
            <div style={styles.typeMessage}>
                {progressPrecent > 0 ? (
                    <LinearProgress
                        sx={{ zIndex: 1000, position: 'absolute', top: "-10px", left: 0, width: '830px', height: "5px", borderRadius: "50px" }}
                        variant='determinate'
                        value={progressPrecent}
                        color='secondary'
                    />
                ) : (null)}
    
                <label htmlFor="file-upload">
                    <FiPaperclip style={styles.icon} />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileUpload}
                />
                <input
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={styles.messageInput}
                    type="text"
                    placeholder="Enter Text"
                    value={text}
                />
                <button onClick={handleSend} style={styles.sendBtn}>
                    Send <IoSend style={styles.sendBtn.icon} />
                </button>
            </div>
        </div>
    );
    

};

export default ChatForm;

const styles = {
    container: {
        paddingLeft: "20px",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowY: "hidden",
    },
    userInfoContainer: {
        borderBottom: "1px solid #d6d6d6",
        display: "flex",
        minWidth: "848px",
        maxWidth: "100%",
        alignItems: 'center',
    },
    userInfo: {
        marginLeft: "20px"
    },
    displayName: {
        fontSize: "21px"
    },
    email: {
        marginTop: "-10px"
    },
    typeMessage: {
        display: "flex",
        alignItems: "center",
        position: "fixed",
        bottom: "10px",
        width: "100%",
    },
    messageInput: {
        marginLeft: "10px",
        paddingLeft: "10px",
        padding: "15px",
        backgroundColor: "white",
        border: "1px solid #d6d6d6",
        outline: "none",
        borderRadius: "15px",
        color: "#222222",
        fontSize: "16px",
        fontWeight: "400",
        width: "610px"
    },
    icon: {
        fontSize: "16px",
        position: "relative",
        top: "1px",
        padding: "16px",
        backgroundColor: "white",
        border: "1px solid #d6d6d6",
        outline: "none",
        borderRadius: "15px",
        color: "#222222",
        fontWeight: "600",
        cursor: "pointer",
    },
    sendBtn: {
        padding: "15px",
        backgroundColor: "#222222",
        border: "none",
        outline: "none",
        borderRadius: "15px",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        position: "relative",
        width: "120px",
        paddingRight: "55px",
        marginLeft: "10px",
        icon: {
            position: "absolute",
            right: "22px",
            top: "15px",
            fontSize: "18px"
        }
    },
    messagesContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingRight: "20px",
        paddingBottom: "20px",
        maxWidth: "calc(100% - 40px)",
        height: "calc(100vh - 180px)",
        overflow: "hidden",
        overflowY: "scroll",
        borderBottom: "1px solid #d6d6d6",
    },
    message: {
        backgroundColor: "#e0e0e0",
        borderRadius: "10px",
        padding: "10px",
        marginTop: "10px",
        maxWidth: "70%",
        alignSelf: "flex-end",
    },
    ownMessage: {
        backgroundColor: "#222222",
        color: "white",
        paddingLeft: "25px",
        paddingRight: "25px",
        marginTop: "10px",
        maxWidth: "70%",
        borderRadius: "10px",
    },
    otherMessage: {
        backgroundColor: "#d9d9d9",
        alignSelf: "flex-start",
        paddingLeft: "25px",
        paddingRight: "25px",
        marginTop: "10px",
        maxWidth: "70%",
        borderRadius: "10px"
    },
    ownImgMessage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        maxWidth: "70%",
        marginTop: "10px",
    },
    otherImgMessage: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "70%",
        marginTop: "10px",
        alignSelf: "flex-start",
    },
    img: {
        maxWidth: "400px",
        borderRadius: "10px",
    },
    noMessagesContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginTop: "10%",
        img: {
            maxWidth: "70%"
        }
    }
}
