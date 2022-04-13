import * as React from 'react';
import ReactDOM from 'react-dom';
import {randomizeDice, NUMBER_OF_DICE} from "./dice";

async function addDieToBoard() {
  const dice = randomizeDice(1)
  const shape = await miro.board.createShape({
    content: dice[0],
    shape: 'round_rectangle',
    width: 35,
    height: 35,
    style: {
      fillColor: '#FFFFFF',
      fontFamily: 'arial',
      fontSize: 24,
      textAlign: 'center',
      textAlignVertical: 'bottom',
    },
  })
}

function App() {
  const [selectedNumberOfDice, setSelectedNumberOfDice] = React.useState(NUMBER_OF_DICE.toString())
  const handleSelectNumberOfDice = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumberOfDice(event.target.value)
  }
  // TODO: uncomment when addDieToBoard supports number of dice
  // const handleAddDieToBoard = () => {
  //   addDieToBoard(parseInt(selectedNumberOfDice, 10))
  // }

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>How to play</h1>
        <p>Click on "Roll dice", and use the dice to tell a story</p>
      </div>
      <div className="cs1 ce12">
        <p>Choose the amount of dice to roll:</p>
        <select className="select" onChange={handleSelectNumberOfDice} value={selectedNumberOfDice}>
          {new Array(NUMBER_OF_DICE).fill(undefined).map((_, index) => (
            <option value={index + 1}>{index + 1}</option>
          ))}
        </select>
      </div>
      <div className="cs1 ce12">
        <button
          className="button button-primary"
          onClick={addDieToBoard}
        >
          Roll dice
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
