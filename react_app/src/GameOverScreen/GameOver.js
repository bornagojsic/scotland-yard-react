import { useLocation } from "react-router-dom";

import "./GameOver.css";

function GameOver () {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	console.log(queryParams);

	const capitalizeWords = (str) => {
		return str.replace(/\b\w/g, (match) => {
			return match.toUpperCase();
		});
	};

	const winner = capitalizeWords(queryParams.get("winner"));

	let reason;

	if (queryParams.get("winner") === "players" && queryParams.get("reason") === "noMoves") {
		reason = <p>Mr. X has no legal moves!</p>;
	}
	else if (queryParams.get("winner") === "players" && queryParams.get("reason") === "caught") {
		reason = <p>Mr. X has been caught!</p>;
	}
	else if (queryParams.get("winner") === "mrx" && queryParams.get("reason") === "escaped") {
		reason = <p>Mr. X has escaped because he wasnt't caught in 22 rounds!</p>;
	} else {
		reason = <p>Player <b>{queryParams.get("reason")}</b> has no legal moves left!</p>;
	}
	return (
		<div className="GameOverScreen">
			<h1>Game Over</h1>
			<h2>{winner} won</h2>
			{reason}
			<button onClick={() => window.location.href = "/game"}>Play Again</button>
			<button onClick={() => window.location.href = "/"}>Back to Start Screen</button>
		</div>
	);
}

export default GameOver;