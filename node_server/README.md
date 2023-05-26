# skotski-vrt
jedan od AI-jeva za Škotski vrt ikad

U README ću pisat noteove tako da možes pogledati kad ti odgovara.
1. Treba popraviti slučaj kada se inicijaliziraju na iste pozicije.

2. MCTS API je opisan na discordu, ali tldr; na neki gamestate (objekt game) inicijaliziraš MCTS(num_iterations, gamestate). Metoda mcts.search vraća najbolji potez u obliku [vehicle, position]. Pogledaj main(). 

Treba odigrati cijelu partiju i pratiti weight ispise kroz cijelu igru. Pred kraj ne bi trebali biti izjednačeni. Ako jesu, onda imamo problem, no, imam par ideja kako to riješiti.
