import { useState, useEffect, useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import './App.css';
import './Board.css';
import './Node.css';
import './Edge.css';
import './Player.css';
import { useMaxWidth, useMaxHeight, useMinDimension } from './Constants';
import Board from './Board';
import Node from './Node';
import Edge from './Edge';
import Player from './Player';
import MrX from './Player';

const nodeR = 5;

const nodes = [
  new Node(10, 10, nodeR, 1),
  new Node(15, 20, nodeR, 2),
  new Node(30, 10, nodeR, 3),
  new Node(20, 50, nodeR, 4),
  new Node(30, 50, nodeR, 5),
  new Node(50, 50, nodeR, 6),
  new Node(50, 20, nodeR, 7),
  new Node(25, 25, nodeR, 8),
  new Node(35, 45, nodeR, 9),
];

const edges = [
  new Edge(nodes[0], nodes[1], 'tax'),
  new Edge(nodes[0], nodes[3], 'bus'),
  new Edge(nodes[2], nodes[3], 'udg'),
  new Edge(nodes[2], nodes[1], 'tax'),
  new Edge(nodes[3], nodes[4], 'udg'),
  new Edge(nodes[4], nodes[8], 'tax'),
  new Edge(nodes[6], nodes[7], 'bus'),
  new Edge(nodes[6], nodes[0], 'bus'),
  new Edge(nodes[5], nodes[8], 'bus'),
  new Edge(nodes[5], nodes[6], 'tax'),
  // new Edge(nodes[7], nodes[0], 'rvr'),
];

const players = [
  new Player("Player 1", 1, 'rgba(250, 0, 0, 1)', nodeR/2, 5, 3, 2),
  new Player("Player 2", 2, 'rgba(0, 0, 250, 1)', nodeR/2, 5, 3, 2),
];

const mrX = new MrX("Mr. X", 3, 'black', nodeR/2, 5, 3, 2, 1, 1);

const board = new Board();

nodes.forEach((node) => { board.addNode(node); });
edges.forEach((edge) => { board.addEdge(edge); });
players.forEach((player) => { board.addPlayer(player); });
board.mrX = mrX;

board.updatePositions();

function App() {
  const [maxWidth, setMaxWidth] = useMaxWidth(window.innerWidth);
  const [maxHeight, setMaxHeight] = useMaxHeight(window.innerHeight);
  const [minDimension, setMinDimension] = useMinDimension(Math.min(maxWidth, maxHeight));
  const [boardPosition, setBoardPosition] = useState({x: 0, y: 0});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const playersRef = useRef(Array(players.length).fill(null));
  const mrXRef = useRef(null);

  const moveCurrentPlayerToPosition = (position) => {
    board.players[currentPlayerIndex].position = position;
    board.updatePositions();
    if (board.players[currentPlayerIndex].position === board.mrX.position) {
      alert("Mr. X has been caught!");
      return;
    }
    setCurrentPlayerIndex((currentPlayerIndex + 1) % board.players.length);
  };

  const moveMrXToPosition = (position) => {
    board.mrX.position = position;
    board.updatePositions();
    setCurrentPlayerIndex((currentPlayerIndex + 1) % board.players.length);
  };

  const moveMrX = () => {
    const possibleNodes = board.nodes[mrX.position - 1].connections.map((connection) => { 
      // if no player is on the node, it is a possible node
      if (!(board.positions.includes(connection.node.index)))
        return connection.node.index; 
    });
    const randomIndex = Math.floor(Math.random() * (possibleNodes.length - 1));
    const randomNode = possibleNodes[randomIndex];
    moveMrXToPosition(randomNode);
    board.round++;
  };

  const handleClick = (index) => {
    return ( () => {
      // console.log("Current index:", index);
      // console.log("All player indices:", board.positions);
      const nodeIndex = board.players[currentPlayerIndex].position;
      const node = board.nodes[nodeIndex - 1];
      const nodeEdges = node.connections;
      const connectedTypes = [];
      nodeEdges.forEach((connection) => {
        if (
          (connection.node.index === index) && 
            (
              (connection.type === 'tax' && board.players[currentPlayerIndex].tax > 0) ||
              (connection.type === 'bus' && board.players[currentPlayerIndex].bus > 0) ||
              (connection.type === 'udg' && board.players[currentPlayerIndex].udg > 0)
            )
          )
          connectedTypes.push(connection.type);
      });
      console.log("Connected types:", connectedTypes);
      if (connectedTypes.length === 0) {
        alert("No cards left for this type of connection!");
        return;
      }
      if (!(board.positions.includes(index))) {
        if (connectedTypes.length > 1) {
          console.log("Connected types:", connectedTypes);
        } else {
          console.log("Connected type:", connectedTypes[0]);
          if (connectedTypes[0] === 'tax') {
            board.players[currentPlayerIndex].tax--;
          } else if (connectedTypes[0] === 'bus') {
            board.players[currentPlayerIndex].bus--;
          } else if (connectedTypes[0] === 'udg') {
            board.players[currentPlayerIndex].udg--;
          }
        }
        console.log("TAX: ", board.players[currentPlayerIndex].tax, "BUS: ", board.players[currentPlayerIndex].bus, "UDG: ", board.players[currentPlayerIndex].udg);
        moveCurrentPlayerToPosition(index);
      }
      if (currentPlayerIndex === board.players.length - 1) {
        moveMrX();
      }
    }
    );
  };
  
  const Nodes = () => {
    return (
      board.nodes.map((node) => {
        // if a player can get to this node from his current node set its color to the player's color
        let color = 'white';
        const currentPlayer = board.players[currentPlayerIndex]
        const playerNode = board.nodes[currentPlayer.position - 1];
        const nodeIsConnected = playerNode.connections.map((connection) => {return connection.node.index}).includes(node.index);
        const nodeIsOccupied = board.positions.includes(node.index);
        const possibleTypes = playerNode.connections.map((connection) => {
          if (connection.node.index === node.index) {
            return ['tax', 'bus', 'udg'].map((type) => {
              if (connection.type === type && currentPlayer[type] > 0) {
                return true;
              }
            }).some((element) => element);
          }
          return false;
        });
        console.log("Possible types:", possibleTypes);
        const connectionExists = possibleTypes.some((element) => element);
        if (nodeIsConnected && connectionExists && !nodeIsOccupied) {
          color = currentPlayer.color;
        }
        return <div 
          className="Node" 
          style={{
            backgroundColor: `${color}`,
            fontSize: 0.5 * node.r/100 * minDimension,
            left: node.x/100 * maxWidth - boardPosition.x,
            top: node.y/100 * maxHeight - boardPosition.y,
            height: node.r/100 * minDimension,
            width: node.r/100 * minDimension,
            transform: `translate(-50%, -50%)`,
          }}
          key={node.index}
          onClick={handleClick(node.index)}
          > 
          {
            nodeIsConnected && !nodeIsOccupied ?
              <div 
                className='transparent-overlay'
                style={{
                  backgroundColor: `rgba(255, 255, 255, 0.5)`,
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >{node.index}
              </div>
            : node.index
          }
        </div>
      })
      );
    };
    
  const Edges = () => {
    return (
      board.edges.map((edge) => {
        const x1 = edge.node1.x/100 * maxWidth /* + edge.node1.r/100 * minDimesion / 2 */;
        const y1 = edge.node1.y/100 * maxHeight /* + edge.node1.r/100 * minDimesion / 2 */;
        const x2 = edge.node2.x/100 * maxWidth /* + edge.node2.r/100 * minDimesion / 2 */;
        const y2 = edge.node2.y/100 * maxHeight /* + edge.node2.r/100 * minDimesion / 2 */;
        const angle = Math.PI-Math.atan2(x1-x2, y1-y2);
        const len = Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
        const color = edge.type === 'udg' ? 'red' : edge.type === 'bus' ? 'blue' : 'black';
        
        let width = 2;

        if (
            (
              (edge.node1.index === board.players[currentPlayerIndex].position) &&
              (!(board.positions.includes(edge.node2.index)))
            ) ||
            (
              (edge.node2.index === board.players[currentPlayerIndex].position) &&
              (!(board.positions.includes(edge.node1.index)))
            )
          ) 
        {
          width = 4;
        }

        return <div 
        className="Edge" 
        style={{
          backgroundColor: color,
          height: len,
          transform: `translate(${x1 - boardPosition.x - width/2}px, ${y1 - boardPosition.y}px) rotate(${angle}rad)`,
          width: `${width}px`,
        }} 
        key={edge.node1.index.toString() + edge.node2.index.toString()}
        >
        </div>
      })
      );
    };
    
  const Players = () => {
    return (
      board.players.map((player, playerIndex) => {
        const index = player.position;
        const size = playerIndex === currentPlayerIndex ? 1.5 : 1;
        return <div 
          className="Player" 
          style={{
            backgroundColor: player.color,
            left: board.nodes[index-1].x/100 * maxWidth - boardPosition.x,
            top: board.nodes[index-1].y/100 * maxHeight - boardPosition.y,
            height: size * player.radius/100 * minDimension,
            width: size * player.radius/100 * minDimension,
            transform: `translate(-50%, -50%)`,
          }}
          key={index}
          ref={(player) => (playersRef.current[playerIndex] = player)}
        >
        </div>
      })
    );
  };

  const MrX = () => {
    const index = mrX.position;
    return <div 
      className="Player" 
      style={{
        backgroundColor: mrX.color,
        left: board.nodes[index-1].x/100 * maxWidth - boardPosition.x,
        top: board.nodes[index-1].y/100 * maxHeight - boardPosition.y,
        height:  mrX.radius/100 * minDimension,
        visibility: board.round % 5 === 3 ? 'visible' : 'hidden',
        width: mrX.radius/100 * minDimension,
        transform: `translate(-50%, -50%)`,
      }}
      key={index}
      onClick={handleClick(index)}
      ref={(mrX) => (mrXRef.current = mrX)}
    >
    </div>;
  };

  const ResizeButtons = () => {
    return (
      <div className="ResizeButtons">
        <button onClick={() => {
          setMaxWidth(maxWidth + 10);
          setMaxHeight(maxHeight + 10);
          setMinDimension(Math.min(maxWidth + 10, maxHeight + 10));
        }}>
          +
        </button>
        <button onClick={() => {
          setMaxWidth(maxWidth - 10);
          setMaxHeight(maxHeight - 10);
          setMinDimension(Math.min(maxWidth - 10, maxHeight - 10));
        }}>
          -
        </button>
      </div>
    );
  };

  const HorizontalSlider = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 0,
      slidesToScroll: 0
    };
  
    return (
      <Slider {...settings}>
      </Slider>
    );
  };

  const CurrentPlayerStats = () => {
    return (
      <div className="CurrentPlayerStats">
        <div className="CurrentPlayerStats__index">
          Current player: {currentPlayerIndex + 1}
        </div>
        <div className="CurrentPlayerStats__position">
          Position: {board.players[currentPlayerIndex].position}
        </div>
        <div className="CurrentPlayerStats__cards">
          Cards: {board.players[currentPlayerIndex].tax} TAX | {board.players[currentPlayerIndex].bus} BUS | {board.players[currentPlayerIndex].udg} UDG
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = (event) => {
      // Get the amount of scroll delta from the event
      const { deltaY } = event;
      
      if (deltaY < 0) {
        setMaxWidth(maxWidth + 10);
        setMaxHeight(maxHeight + 10);
        setMinDimension(Math.min(maxWidth + 10, maxHeight + 10)
        );
      } else {
        setMaxWidth(maxWidth - 10);
        setMaxHeight(maxHeight - 10);
        setMinDimension(Math.min(maxWidth - 10, maxHeight - 10)
        );
      }
    };

    // Attach the wheel event listener to the window object
    window.addEventListener('wheel', handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [maxHeight, maxWidth, setMaxHeight, setMaxWidth, setMinDimension]);

  return (
    <div className="App">
      {/* <MoveBoard> */}
      <Nodes/>
      <Edges/>
      <Players/>
      <MrX/>
      <CurrentPlayerStats/>
      {/* </MoveBoard> */}
      <HorizontalSlider/>
      {/* <ResizeButtons/> */}
    </div>
  );

  
  // const MoveBoard = ({ children }) => {
  //   const [isDragging, setIsDragging] = useState(false);
  //   const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  //   const handleMouseDown = (event) => {
  //     setIsDragging(true);
  //     const offsetX = event.clientX - boardPosition.x;
  //     const offsetY = event.clientY - boardPosition.y;
  //     setDragOffset({ x: offsetX, y: offsetY });
  //   };

  //   const handleMouseMove = (event) => {
  //     if (isDragging) {
  //       const newX = event.clientX - dragOffset.x;
  //       const newY = event.clientY - dragOffset.y;
  //       setBoardPosition({ x: newX, y: newY });
  //     }
  //   };

  //   const handleMouseUp = () => {
  //     setIsDragging(false);
  //   };

  //   // useEffect(() => {
  //   //   document.addEventListener('mousemove', handleMouseMove);
  //   //   document.addEventListener('mouseup', handleMouseUp);
  
  //   //   return () => {
  //   //     document.removeEventListener('mousemove', handleMouseMove);
  //   //     document.removeEventListener('mouseup', handleMouseUp);
  //   //   };
  //   // }, []);

  //   return (
  //     <div
  //       onMouseDown={handleMouseDown}
  //       onMouseMove={handleMouseMove}
  //       onMouseUp={handleMouseUp}
  //       style={{ 
  //         height: maxHeight,
  //         // background: dragging ? 'rgba(200,200,0,0.4)' : 'rgba(0,200,200,0.5)'
  //       }}
  //       width={maxWidth}
  //     >
  //       {children}
  //     </div>
  //   );
  // };
}

export default App;
