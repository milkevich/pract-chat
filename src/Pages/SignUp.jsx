import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box } from '@mui/system';
import { auth, storage, db } from '../firebaseConfig';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, updateProfile, createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Avatar } from '@mui/material';
import { doc, setDoc } from 'firebase/firestore';

function SignUp() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [displayNameError, setDisplayNameError] = useState(false);
    const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
    const [alert, setAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [file, setFile] = useState(null);
    const [fileURL, setFileURL] = useState(null);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();

        if (!emailError && !passwordError && !displayNameError && file) {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                const date = new Date().getTime();
                const storageRef = ref(storage, `${displayName + date}`);
                await uploadBytesResumable(storageRef, file).then(() => {
                    getDownloadURL(storageRef).then(async (downloadURL) => {
                        await updateProfile(user, {
                            displayName,
                            photoURL: downloadURL,
                        });

                        const userRef = doc(db, "users", user.uid);
                        await setDoc(userRef, {
                            uid: user.uid,
                            displayName,
                            email,
                            photoURL: downloadURL,
                        });

                        await setDoc(doc(db, "userChats", user.uid), {});

                        navigate('/pract-chat/chat');
                    });
                });
            } catch (error) {
                console.error("Error creating user:", error);
                setAlert(true)
                setAlertMessage('The user with this email already exists, try again.')
            }
        } else {
            if (emailError) {
                setAlert(true);
                setAlertMessage('Email address is not valid or already being used.');
            } else {
                setAlert(false);
                setAlertMessage('');
            }
            if (passwordError) {
                setAlert(true);
                setAlertMessage('Please enter a valid password.');
            } else {
                setAlert(false);
                setAlertMessage('');
            }
            if (displayNameError) {
                setAlert(true);
                setAlertMessage('Please enter a valid display name.');
            } else {
                setAlert(false);
                setAlertMessage('');
            }
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setFileURL(URL.createObjectURL(selectedFile));
    };

    const emailValidation = (e) => {
        const pattern = /^[^]+@[^]+\.[a-z]{2,3}$/;
        const emailValue = e.target.value;
        setEmail(emailValue);

        if (emailValue === '' || !emailValue.match(pattern)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address');
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }
    };

    const passwordValidation = (e) => {
        const passwordValue = e.target.value;
        setPassword(passwordValue);

        if (passwordValue === '' || passwordValue.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('You must have at least 6 characters');
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }
    };

    const displayNameValidation = (e) => {
        const displayNameValue = e.target.value;
        setDisplayName(displayNameValue);

        if (displayNameValue === '') {
            setDisplayNameError(true);
            setDisplayNameErrorMessage('You must enter your full name.');
        } else {
            setDisplayNameError(false);
            setDisplayNameErrorMessage('');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleGoogleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {
                console.log("Google Sign-In successful:", result.user);
                navigate('/pract-chat/chat');
            })
            .catch((error) => {
                console.error("Google Sign-In failed:", error);
                setAlert(true);
            });
    };

    const styles = {
        container: {
            maxWidth: "400px",
            margin: "auto",
            padding: "50px",
            textAlign: "center",
            marginTop: "-25px",
        },
        p: {
            marginTop: "-10px",
            color: "#6B6B6B"
        },
        photoUpload: {
            margin: "auto",
            width: "102px",
            height: "102px",
            marginBottom: "30px",
        },
        photoUploadButton: {
            paddingLeft: "20px",
            paddingRight: "20px",
            paddingTop: "5px",
            paddingBottom: "5px",
            borderRadius: "20px",
            border: "1px solid black",
            outline: "none",
            cursor: "pointer",
            backgroundColor: "white",
        },
        inputContainer: {
            margin: "0 auto",
            marginTop: "30px",
            alignItems: "center",
            justifyContent: "center",
        },
        btn: {
            width: "70%",
            padding: "10px",
            border: "none",
            outline: "none",
            backgroundColor: "black",
            color: "white",
            borderRadius: "50px",
            marginTop: "20px",
            cursor: "pointer",
            height: "45px",
            fontWeight: "600"
        },
        googleBtn: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: "70%",
            padding: "10px",
            border: "none",
            outline: "none",
            backgroundColor: "#D9D9D9",
            color: "black",
            borderRadius: "50px",
            marginTop: "10px",
            cursor: "pointer",
            height: "45px",
            fontWeight: "600",
            marginLeft: "60px",
            icon: {
                paddingRight: "10px"
            }
        },
        suggestion: {
            color: "#6B6B6B",
            marginTop: "50px"
        },
        link: {
            textDecoration: "none",
            color: "black",
            fontWeight: "500"
        }
    };

    const logIn = () => {
        navigate('/pract-chat/log-in')
    }

    return (
        <div style={styles.container}>
            {alert ? (<Alert severity="error">{alertMessage}</Alert>) : null}
            <h1>Welcome!</h1>
            <p style={styles.p}>Please enter your information</p>
            <div style={styles.inputContainer}>
                <Avatar src={fileURL} style={styles.photoUpload}></Avatar>
                <div style={{ marginBottom: "20px" }}>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <label htmlFor="fileInput" style={styles.photoUploadButton}>
                        Upload a photo
                    </label>
                </div>
                <TextField color='primary' error={displayNameError} helperText={displayNameErrorMessage} onChange={displayNameValidation} value={displayName} sx={{ width: "70%" }} id="standard-basic" label="Display Name" variant="standard" />
                <TextField color='primary' error={emailError} helperText={emailErrorMessage} onChange={emailValidation} value={email} sx={{ width: "70%", marginTop: "20px" }} id="standard-basic" label="Email" variant="standard" />
                <Box sx={{ alignItems: 'center', position: 'relative' }}>
                    <TextField error={passwordError} helperText={passwordErrorMessage} onChange={passwordValidation} sx={{ width: "70%", marginTop: "20px" }} id="standard-password-input" label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" variant="standard" />
                    {showPassword ? (
                        <VisibilityOutlinedIcon onClick={togglePasswordVisibility} sx={{ marginTop: "40px", marginLeft: "-25px", position: "absolute", cursor: "pointer" }} />
                    ) : (
                        <VisibilityOffOutlinedIcon onClick={togglePasswordVisibility} sx={{ marginTop: "40px", marginLeft: "-25px", position: "absolute", cursor: "pointer" }} />
                    )}
                </Box>
                <button onClick={submit} style={styles.btn}>Sign Up</button>
                <button onClick={handleGoogleSignIn} style={styles.googleBtn}>
                    <FcGoogle style={styles.googleBtn.icon} size={20} />Sign Up with Google
                </button>
            </div>
            <p style={styles.suggestion}>
                Already Have an account? <button style={styles.link} onClick={logIn}>Log In</button>
            </p>
        </div>
    );
}

export default SignUp;
