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

const nodes = [
  new Node(10, 10, 10, 1),
  new Node(15, 20, 10, 2),
  new Node(30, 10, 10, 3),
  new Node(20, 50, 10, 4),
];

const edges = [
  new Edge(nodes[0], nodes[1], 'tax'),
  new Edge(nodes[0], nodes[3], 'bus'),
  new Edge(nodes[2], nodes[3], 'udg'),
  new Edge(nodes[2], nodes[1], 'tax'),
];

const players = [
  new Player(1, 'red', 5, 5, 3, 2),
  new Player(2, 'blue', 5, 5, 3, 2),
];

const board = new Board();

nodes.forEach((node) => { board.addNode(node); });
edges.forEach((edge) => { board.addEdge(edge); });
players.forEach((player) => { board.addPlayer(player); });

board.updatePositions();

function App() {
  const [maxWidth, setMaxWidth] = useMaxWidth(window.innerWidth);
  const [maxHeight, setMaxHeight] = useMaxHeight(window.innerHeight);
  const [minDimension, setMinDimension] = useMinDimension(Math.min(maxWidth, maxHeight));
  const [boardPosition, setBoardPosition] = useState({x: 0, y: 0});
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const playersRef = useRef(Array(players.length).fill(null));

  const moveCurrentPlayerToPosition = (position) => {
    board.players[currentPlayerIndex].position = position;
    board.updatePositions();
    /* console.log("Current player postion: " + playersRef.current[currentPlayerIndex].style.left + ", " + playersRef.current[currentPlayerIndex].style.top);
    const updatedPlayers = [...playersRef.current];

    updatedPlayers[currentPlayerIndex].style.left = board.nodes[position - 1].x/100 * maxWidth + 'px';
    updatedPlayers[currentPlayerIndex].style.top = board.nodes[position - 1].y/100 * maxHeight + 'px';

    // Update the playersRef
    playersRef.current = updatedPlayers;
    console.log("New player postion: " + playersRef.current[currentPlayerIndex].style.left + ", " + playersRef.current[currentPlayerIndex].style.top);
    console.log("New player position: " + board.players[currentPlayerIndex].position); */
    setCurrentPlayerIndex((currentPlayerIndex + 1) % board.players.length);
  };

  const handleClick = (object, index) => {
    return ( () => {
      console.log("Current index:", index);
      console.log("All player indices:", board.positions);
      const nodeIndex = board.players[currentPlayerIndex].position;
      const node = board.nodes[nodeIndex - 1];
      const nodeEdges = node.connections;
      const connectedNodes = nodeEdges.map((connection) => {
        return connection.node.index;
      });
      if (connectedNodes.includes(index) && (!(board.positions.includes(index)))) {
        moveCurrentPlayerToPosition(index);
      }
    }
    );
  };
  
  const Nodes = () => {
    return (
      board.nodes.map((node) => {
        return <div 
          className="Node" 
          style={{
            fontSize: 0.5 * node.r/100 * minDimension,
            left: node.x/100 * maxWidth - boardPosition.x,
            top: node.y/100 * maxHeight - boardPosition.y,
            height: node.r/100 * minDimension,
            width: node.r/100 * minDimension,
            transform: `translate(-50%, -50%)`,
          }}
          key={node.index}
          onClick={handleClick(node, node.index)}
          > 
          {node.index}
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
        const color = edge.type === 'tax' ? 'black' : edge.type === 'bus' ? 'blue' : 'red';
        
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
          width = 8;
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
          onClick={handleClick(player, index)}
          ref={(player) => (playersRef.current[playerIndex] = player)}
        >
        </div>
      })
    );
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

  return (
    <div className="App">
      {/* <MoveBoard> */}
      <Nodes/>
      <Edges/>
      <Players/>
      <CurrentPlayerStats/>
      {/* </MoveBoard> */}
      <HorizontalSlider/>
      <ResizeButtons/>
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
