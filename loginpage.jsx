import React from 'react';
import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)
  
  const styles = {
    mainContainer: {
    boxSizing: 'border-box',
      padding: '30px 20px',
    display:"flex",
    "flex-direction":"column",
    "align-items":"center",
    "justify-content":"center",
      border:"1px solid #000",
      margin: '20px auto',
      backgroundColor: '#fff',
  
    },
    title: {
      color: '#5C6AC4',
        "margin-bottom": '25px',
      fontSize: '32px',
    },
    loginpageWord:{
      textalign:"center"
    },
    usernamepassFlex:{
      display:"flex",
      "flex-direction":"column",
      gap:"10px"
    },
    inputStyle:{
      padding:"5px",
      "max-width":"400px",
      width:"100%"

    },
    btnStyle:{
      "margin-top":"15px",
        padding:"7px 20px",
        cursor:"pointer",
        background:"black",
        border:"none",
        color:"white",
        "font-weight":"600",
        "border-radius":"8px"

    },
    usernameinputColflex:{
      display:"flex",
      "flex-direction":"column",
      gap:"5px"

    },
    nstylecolor:{
      color:"skyblue",
      "font-weight":"600",
    },
    usernameWord:{
      
    }
    

  };

  return (
    <div style={styles.mainContainer}>
    <div>
    <h1 style={styles.loginpageWord}>Logi<span style={styles.nstylecolor}>n</span> </h1>
    </div>
    <div style={styles.usernamepassFlex}>
    <div style={styles.usernameinputColflex}>
    <div style={styles.usernameWord}>Username</div>
    <div> <input style={styles.inputStyle} />  </div>
    </div>
     <div style={styles.usernameinputColflex}>
     <div>Password</div>
    <div> <input style={styles.inputStyle} />  </div>
     </div>
    </div>

    <div>
    <button style={styles.btnStyle}>Login</button>
    </div>
    
    </div>
  )
}

export default App
