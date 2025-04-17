import { useState, useRef, useEffect } from 'react'
import Confetti from 'react-confetti'
import Die from "./components/Die.jsx"
import { nanoid } from 'nanoid'

function App() {

  // const [dice , setDice] = React.useState(getAllNewNumbers()) //This function had calling the initial function like getAllNewNumber every time but we should call it only one time
  const [dice, setDice] = useState(() => getAllNewNumbers())   //so i have converted that code into new condition whre it will call only one time
  const [rollCount, setRollCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [isTimeUp, setIsTimeUp] = useState(false)
  const [isRollLimitReached, setIsRollLimitReached] = useState(false)
  const buttonRef = useRef(null)

  /* to check 2 conditions that one is that if all dices have held and 2nd condition is that all dices have same value */


  const gameWon = dice.every(die => die.isHeld) &&
    dice.every(die => die.value === dice[0].value)
  /* Additional functionality to check if [gameover, gamewon and timeover] then stop the game */
  // Timer effect
  useEffect(() => {
    let intervalId;
    if (!gameWon && !isTimeUp && !isRollLimitReached) {
      intervalId = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            setIsTimeUp(true)
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalId)
  }, [gameWon, isTimeUp , isRollLimitReached])

  /* This function will focus on newgame button when gamwon  */
  useEffect(() => {
    if (gameWon) {
      buttonRef.current.focus()
    }
  }, [gameWon])

  useEffect(() => {
    if (rollCount === 15 && !gameWon) {
        setIsRollLimitReached(true)
    }
}, [rollCount, gameWon])

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
      .map(() => ({
        value: Math.ceil(Math.random() * 6),
        // value : 5,
        isHeld: false,
        id: nanoid()
      }))
  }
  /* calling this function to get new items by clicking the button */
  /* and updating that which items are green not to be call them */
  function rollDice() {
    if (gameWon || isTimeUp || isRollLimitReached) {
      // Start new game
      setDice(getAllNewNumbers())
      setRollCount(0)
      setTimeLeft(60)
      setIsTimeUp(false)
      setIsRollLimitReached(false)

    } else {
      // Roll the dice
      setDice(oldDie => oldDie.map(die =>
        die.isHeld ? die : { ...die, value: Math.ceil(Math.random() * 6) }
      ))
      setRollCount(prev => prev + 1)
    }

  }
  /* This function is for holding one item */
  function hold(id) {
    if (isTimeUp || isRollLimitReached) return
    setDice(prevItem =>
      prevItem.map((item) => (
        item.id === id ? { ...item, isHeld: !item.isHeld } : item
      )
      )
    )
  }

  /* To display all items on the screen */
  const renderAllDices = dice.map(dieObj => <Die
    value={dieObj.value}
    key={dieObj.id}
    id={dieObj.id}
    isHeld={dieObj.isHeld}
    hold={() => hold(dieObj.id)}
  />)



  return (
    <main>
      {gameWon && <Confetti />}
      <div aria-live='polite' className='sr-only'>
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="game-info">
        <div>Time Left: {timeLeft}s</div>
        <div>Rolls: {rollCount}/15</div>
      </div>
      {isTimeUp && !gameWon && <p className="game-over">Time's up! Game over!</p>}
      {isRollLimitReached && !gameWon && <p className='game-over'>Maximum rolls reached! Game over!</p>}
      {gameWon && "Hurra ... You won the game!"}
      <div className="dice-container">
        {renderAllDices}
      </div>
      <button ref={buttonRef} className='roll-dice' onClick={rollDice}>{gameWon ? "New Game" 
        : isTimeUp ? "Time's Up! Play Again"
        : isRollLimitReached ? "Max Rolls! Play Again"
        : "Roll"
      }</button>
      
    </main>
  )
}

export default App