import { React, useState } from 'react';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Box } from '@mui/system';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebaseConfig';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const LogIn = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
    const [alert, setAlert] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        if (!emailError || !passwordError) {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    navigate('/pract-chat/chat');
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.log(error);
                    setAlert(true);
                });
        }
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
        },
        p: {
            marginTop: "-10px",
            color: "#6B6B6B"
        },
        inputContainer: {
            margin: "0 auto",
            marginTop: "50px",
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
            marginTop: "20px",
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
            fontWeight: "500",
            cursor: "pointer"
        }
    };

    return (
        <div style={styles.container}>
            {alert ? (<Alert severity="error">Your email or password is incorrect.</Alert>) : null}
            <h1>Welcome Back!</h1>
            <p style={styles.p}>Please enter your information</p>
            <div style={styles.inputContainer}>
                    <TextField color='primary' error={emailError} helperText={emailErrorMessage} onChange={emailValidation} value={email} sx={{ width: "70%" }} id="standard-basic" label="Email" variant="standard" />
                    <Box sx={{ alignItems: 'center', position: 'relative' }}>
                        <TextField error={passwordError} helperText={passwordErrorMessage} onChange={passwordValidation} sx={{ width: "70%", marginTop: "20px" }} id="standard-password-input" label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" variant="standard" />
                        {showPassword ? (
                            <VisibilityOutlinedIcon onClick={togglePasswordVisibility} sx={{ marginTop: "40px", marginLeft: "-25px", position: "absolute", cursor: "pointer" }} />
                        ) : (
                            <VisibilityOffOutlinedIcon onClick={togglePasswordVisibility} sx={{ marginTop: "40px", marginLeft: "-25px", position: "absolute", cursor: "pointer" }} />
                        )}
                    </Box>
                    <button onClick={submit} style={styles.btn}>Log In</button>
                    <button onClick={handleGoogleSignIn} style={styles.googleBtn}>
                        <FcGoogle style={styles.googleBtn.icon} size={20} /> Log In with Google
                    </button>            
                </div>
            <p style={styles.suggestion}>
                Don't Have an account? <a style={styles.link} onClick={(() => {navigate('/pract-chat/sign-up')})}>Sign Up</a>
            </p>
        </div>
    );
};

export default LogIn;
