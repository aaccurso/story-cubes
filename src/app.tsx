import * as React from 'react';
import ReactDOM from 'react-dom';

async function addSticky() {
  // const stickyNote = await miro.board.createStickyNote({
  //   content: 'Hello, World!',
  // });

  // await miro.board.viewport.zoomTo(stickyNote);
}

function App() {
  React.useEffect(() => {
    addSticky();
  }, []);

  return (
    <div className="grid wrapper">
      <div className="cs1 ce12">
        <h1>How to play</h1>
        <p>Click on "Roll dice", and use the dice to tell a story</p>
      </div>
      <div className="cs1 ce12">
        <button
          className="button button-primary"
        >
          Roll dice
        </button>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
