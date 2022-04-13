import { ShapeProps } from '@mirohq/websdk-types';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {randomizeDice, NUMBER_OF_DICE} from "./dice";

async function addDieToBoard(die: Partial<ShapeProps>) {
  const shape = await miro.board.createShape({
    shape: 'round_rectangle',
    ...die,
    style: {
      fillColor: "#ffffff",
      fontFamily: "arial",
      fontSize: 148,
      textAlign: "center",
      textAlignVertical: "bottom",
      ...die.style,
    },
  })
}

type Coord = {
  x: number,
  y: number,
}
async function addDiceToBoard(start: Coord, faces: string[], dicePerSide: number, diceSize: number, diceSpacing: number) {
  faces.forEach((face, index) => {
    const row = Math.floor(index / dicePerSide)
    const col = Math.floor(index % dicePerSide)

    console.log('row', row)

    const positionCorrection = -((dicePerSide-1)*diceSize + (dicePerSide-1)*diceSpacing)/2

    const position: Coord = {
      x: start.x + diceSize * col + diceSpacing * col + positionCorrection,
      y: start.y + diceSize * row + diceSpacing * row + positionCorrection,
    }

    console.log('position', position)

    addDieToBoard({
      ...position,
      content: face,
      width: diceSize,
      height: diceSize,
      style: {
        fontSize: Math.round(diceSize * 148/215)
      }
    })
  });
}

async function rollDice(numberOfDice: number) {
  console.log(`Rolling ${numberOfDice} Dice'`)

  const selection = await miro.board.getSelection();

  console.log('SELECTION', selection)

  if (selection.length !== 1) {
    console.error('need to select exactly 1 container')
    return
  }
  const container = selection[0]
  if (container.type !== 'shape') {
    console.error('container needs to be a shape')
    return
  }


  // const faces: string[] = ['🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶', '🐶'] //randomize(9);g
  const faces = randomizeDice(numberOfDice)

  const dicePerSide = Math.ceil(Math.sqrt(numberOfDice))
  const diceSize = Math.min(container.height, container.width)/(dicePerSide*2)
  const diceSpacing = diceSize/3

  const start: Coord = {
    x: container.x,
    y: container.y,
  }

  addDiceToBoard(start, faces, dicePerSide, diceSize, diceSpacing)
}

function App() {
  const [selectedNumberOfDice, setSelectedNumberOfDice] = React.useState(NUMBER_OF_DICE.toString())
  const handleSelectNumberOfDice = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedNumberOfDice(event.target.value)
  }
  const handleRollDice = () => {
    rollDice(parseInt(selectedNumberOfDice, 10))
  }

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
          onClick={handleRollDice}
        >
          Roll dice
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
