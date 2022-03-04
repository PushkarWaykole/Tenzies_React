import "./styles.css";
import React from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confitte from "react-confetti";

let scores = [];
export default function App() {
  const [dice, setDice] = React.useState(allNewDie());
  const [tenzies, setTenzies] = React.useState(false);
  const [rolls, setRolls] = React.useState(0);

  function getMinScore() {
    return Math.min(...scores);
  }

  React.useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allsameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allsameValue) {
      setTenzies(true);
      localStorage.setItem("highscore", 0);
      scores.push(rolls);
      localStorage.setItem("highscore", getMinScore());
      console.log(scores);
      console.log("New highscore set");
      console.log(localStorage.getItem("highscore"));
      console.log("You won!");
    }
  }, [dice, rolls]);

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    };
  }
  function allNewDie() {
    const newDie = [];
    for (let i = 0; i < 10; i++) {
      newDie.push(generateNewDie());
    }
    return newDie;
  }

  function rollDice() {
    if (!tenzies) {
      setDice((oldDie) =>
        oldDie.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setRolls((prevCount) => prevCount + 1);
    } else {
      //When the game is won

      setTenzies(false);
      setDice(allNewDie());
      setRolls(0);
      console.log("New game button is pressed");
    }
  }

  function holdDie(id) {
    setDice((oldDie) =>
      oldDie.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }

  const diceElements = dice.map((die) => (
    <Die
      key={die.id}
      isHeld={die.isHeld}
      value={die.value}
      holdDie={() => holdDie(die.id)}
    />
  ));

  return (
    <main>
      {tenzies && <Confitte />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all the dice are the same.Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice--container">{diceElements}</div>
      <button className="roll--die" onClick={rollDice}>
        {tenzies ? "New Game" : "Roll"}
      </button>
      <p className="rolls">Number of rolls:{rolls}</p>
      <p className="highScore">
        Your latest high score is: {localStorage.getItem("highscore")}
      </p>
      <p>Your previous scores are: {scores.map((score) => score + " ")} </p>
    </main>
  );
}
