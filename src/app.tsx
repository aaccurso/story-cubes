import {BoardNode, Frame,ShapeProps} from '@mirohq/websdk-types';
import * as React from 'react';
import ReactDOM from 'react-dom';
import {NUMBER_OF_DICE, randomizeDice} from "./dice";
import {Variants} from "./variants";
import {useVariants} from "./useVariants";

function projectLocalToGlobalCoord(frame: Frame, coord: Coord) {
  return {
    x: (frame.x - frame.width/2) + coord.x,
    y: (frame.y - frame.height/2) + coord.y,
  }
}

// DOES IT WORK?
function projectGlobalToLocalCoord(frame: Frame, coord: Coord) {
  return {
    x: coord.x - (frame.x - frame.width/2),
    y: coord.y - (frame.y - frame.height/2),
  }
}

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

  return shape
}

type Coord = {
  x: number,
  y: number,
}
async function addDiceToBoard(start: Coord, faces: string[], dicePerSide: number, diceSize: number, diceSpacing: number, parent?: BoardNode) {
  faces.forEach(async (face, index) => {
    const row = Math.floor(index / dicePerSide)
    const col = Math.floor(index % dicePerSide)

    const positionCorrection = -((dicePerSide-1)*diceSize + (dicePerSide-1)*diceSpacing)/2

    const position: Coord = {
      x: start.x + diceSize * col + diceSpacing * col + positionCorrection,
      y: start.y + diceSize * row + diceSpacing * row + positionCorrection,
    }

    console.log('die position', position)

    const die = await addDieToBoard({
      ...position,
      content: face,
      width: diceSize,
      height: diceSize,
      style: {
        fontSize: Math.round(diceSize * 148/215)
      },
    })
  });
}

async function rollDice(numberOfDice: number) {
  console.log(`Rolling ${numberOfDice} Dice`)

  const container = await getContainer()

  if (!container) {
    console.error('container not found')
    return
  }

  const faces = randomizeDice(numberOfDice)

  const dicePerSide = Math.ceil(Math.sqrt(numberOfDice))
  const diceSize = Math.min(container.height, container.width)/(dicePerSide*2)
  const diceSpacing = diceSize/3

  let start: Coord = {
    x: container.x,
    y: container.y,
  }

  let parent: Frame | undefined
  if (container.parentId) {
    parent = await miro.board.getById(container.parentId) as Frame

    start = projectLocalToGlobalCoord(parent, start)
  }

  addDiceToBoard(start, faces, dicePerSide, diceSize, diceSpacing, parent)
}

async function getContainer () {
  const selection = await miro.board.getSelection()
  if (selection.length === 1 && selection[0].type === 'shape' && selection[0].shape === 'cloud') {
    return selection[0]
  }

  const viewport = await miro.board.viewport.get()
  const view = {
    x1: viewport.x ,
    x2: viewport.x + viewport.width,
    y1: viewport.y,
    y2: viewport.y + viewport.height,
  }
  const widgets = await miro.board.get({ type: 'shape' })
  const container = widgets.find(async widget => {
    if (widget.shape !== 'cloud') {
      return false
    }
    let element: BoardNode | Frame = widget
    if (element.parentId) {
      element = await miro.board.getById(element.parentId) as Frame
    }

    return element.x >= view.x1 && element.x <= view.x2
    && element.y >= view.y1 && element.y <= view.y2
  })

  console.log('viewport', viewport)
  console.log('view', view)
  console.log('widgets', widgets)
  console.log('container', container)

  return container
}

function App() {
  const handleRollDice = () => {
    rollDice(NUMBER_OF_DICE)
  }
  const {
    variantParticipants,
    selectedNumberOfParticipants,
    handleSelectedNumberOfParticipants,
    selectedVariant,
    handleSelectVariant
  } = useVariants();

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <p>Dice breaker is an icebreaker where player randomly are given some graphic to make up a story out of it. To set it up, follow the steps below:</p>
      </div>
      <div className="cs1 ce12">
        <p>1. Choose the amount of players you want:</p>
        <select className="select" onChange={handleSelectedNumberOfParticipants} value={selectedNumberOfParticipants}>
          {variantParticipants.map((value) => (
            <option key={value} value={value}>{value}</option>
          ))}
        </select>
      </div>
      <div className="cs1 ce12">
        <Variants selectedVariant={selectedVariant} onSelectVariant={handleSelectVariant}/>
      </div>
      <div className="cs1 ce12">
        <p>3. Hit the button and you can start playing now!</p>
        <button
          className="button button-primary"
          onClick={handleRollDice}
        >
          Play the dice!
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
