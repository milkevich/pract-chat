import React from 'react'
import notFound from '../imgs/404.png'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {

    const navigate = useNavigate()

    const goBack = () => {
        navigate('/pract-chat/chat')
    }  

  return (
    <div style={styles.container}>
        <img style={styles.img} src={notFound} alt="404 not found" />
        <h1 style={styles.h1}>Oops! We've wandered off the trail!</h1>
        <p style={styles.p}>Seems like the path you're seeking doesn't exist. Let's find our way back together!</p>
        <button onClick={goBack} style={styles.btn}>Go Back</button>
    </div>
  )
}

export default NotFound

const styles = {
    container: {
        margin: "auto",
        textAlign: "center",
        marginTop: "5%"
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