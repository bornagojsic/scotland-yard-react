import './About.css'

function About () {
	return (
		<div className="About">
			<h1>About</h1>
			<p>This web app was made by Borna Gojšić. The AI for Mr. X was made in collaboration with Ivan Bevanda</p>
			<p>Here is a <a href="https://www.github.com/bornagojsic/scotland-yard-react" target='_blank' rel="noreferrer">link</a> to the Github repository of this project</p>
			<button onClick={() => window.location.href = "/"}>Back to Start Screen</button>
		</div>
	);
}

export default About;