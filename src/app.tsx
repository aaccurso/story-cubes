import * as React from 'react';
import ReactDOM from 'react-dom';

async function addDieToBoard() {
  const shape = await miro.board.createShape({
    content: '😅',
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

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>How to play</h1>
        <p>Click on "Roll dice", and use the dice to tell a story</p>
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
