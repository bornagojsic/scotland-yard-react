import './HowToPlay.css'

function About () {
	return (
		<div className="HowToPlay">
			<h1>How To Play</h1>
			<h2>Scotland Yard Rules</h2>
			<p>Scotland Yard is a board game in which a team of players, as police, cooperate to track down a player controlling a criminal around a board representing the streets of London. It is named after Scotland Yard, the headquarters of London's Metropolitan Police Service. Scotland Yard is an asymmetric board game, with the detective players cooperatively solving a variant of the pursuit-evasion problem. The game is published by Ravensburger in most of Europe and Canada and by Milton Bradley in the United States. It received the Spiel des Jahres (Game of the Year) award in 1983.</p>
			<h2>Controls</h2>
			<p>You can zoom in and out of the map by scrolling and move the your view with the slider on the right side of the map and in on the bottom of the screen</p>
			<button onClick={() => window.location.href = "/"}>Back to Start Screen</button>
		</div>
	);
}

export default About;