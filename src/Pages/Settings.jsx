import React from 'react'
import working from '../imgs/working.png'
import { useNavigate } from 'react-router-dom'

const Settings = () => {

    const navigate = useNavigate()

    const goBack = () => {
        navigate('/pract-chat/chat')
    }   

  return (
    <div style={styles.container}>
        <img style={styles.img} src={working} alt="working" />
        <h1 style={styles.h1}>Oops!.. Still Under Construction</h1>
        <p style={styles.p}>Excuse the dust! We're sprucing things up.</p>
        <button onClick={goBack} style={styles.btn}>Go Back</button>
    </div>
  )
}

export default Settings

const styles = {
    container: {
        margin: "auto",
        textAlign: "center",
        marginTop: "5%",
    },
    img: {
        maxWidth: "600px"
    },
    h1: {
        color: "#222222"
    },
    p: {
        marginTop: "-10px",
        marginBottom: "40px",
        color: "darkgrey"
    },
    btn: {
        padding: "15px",
        paddingLeft: "35px",
        paddingRight: "35px",
        backgroundColor: "#222222",
        border: "none",
        outline: "none",
        borderRadius: "15px",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
        textDecoration: "none"
    }
}