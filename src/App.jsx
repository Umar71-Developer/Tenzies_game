import React from 'react'
import Die from "./components/Die.jsx"
import { nanoid } from 'nanoid'

function App() {
  
const [dice , setDice] = React.useState(getAllNewNumbers())


                      /* to check 2 conditions that one is that if all dices have held and 2nd condition is that all dices have same value */
                     
    
      const gameWon = dice.every(die => die.isHeld) &&
      dice.every(die => die.value === dice[0].value)
                        

                                                    /* section for get random numbers using 2 methods  */
  function getAllNewNumbers() {
    // let allDice = []
    // for(let i = 0; i < 10; i++){
    //  const random = Math.ceil(Math.random() * 6)
    //  allDice.push(random)
    // }
    // return allDice;
    return new Array(10)
              .fill(0)
              .map(() =>( {
                value : Math.ceil(Math.random() * 6),
                isHeld : false,
                id: nanoid()
              }))
  }
                                                /* calling this function to get new items by clicking the button */
                                                /* and updating that which items are green not to be call them */
   function rollDice() {
    setDice(oldDie => oldDie.map(die => 
      die.isHeld ? die :{...die , value : Math.ceil(Math.random() * 6)}
    ))
   }
                                               /* This function is for holding one item */
   function hold(id){
    setDice(prevItem => 
       prevItem.map((item) =>(
         item.id === id ? {...item , isHeld : !item.isHeld} : item
      )
    )
    )
  }
  
                                                /* To display all items on the screen */
const renderAllDices = dice.map(dieObj => <Die 
  value={dieObj.value} 
  key = {dieObj.id}
  id = {dieObj.id}
  isHeld = {dieObj.isHeld}
  hold = {() => hold(dieObj.id)}
  />)
 
  return (
    <main>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
      {renderAllDices}
      </div>
      <button className='roll-dice' onClick={rollDice}>{gameWon ? "New Game" : "Roll"}</button>
    </main>
  )
}

export default App