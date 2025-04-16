import React from 'react'

function Die(props) {


  let styles = {
    backgroundColor : props.isHeld ? "#59E391" : "white"
  }
  return (
    
      <button onClick={props.hold} style={styles}>{props.value}</button>
    
    
  )
}

export default Die