from constants import *
from board import Board
from player import Detective, MrX
from game import Game
from mcts import Node, MCTS
import sys

ai_move = None
game_ids = []
games = {}
## default
num_iters=1000

if (len(sys.argv) == 1):
	game_id = int(sys.argv[1])
if (len(sys.argv) == 2):
	game_id = int(sys.argv[1])
	num_iters = int(sys.argv[2])


def clear_games():
    global games, game_ids
    if len(games) > 10:
        del games[game_ids[0]]
        game_ids = game_ids[1:]

class Playing():
	
	def __init__(self):
		pass

	def play_vs_mcts(self, hide_mrx=False, hide_evaluations=False):
		num_iters = int(input("Enter number of MCTS iterations per move: "))
		board = Board("tax.txt", "bus.txt", "udg.txt", "rvr.txt")   
		d1 = Detective("Detective 1")
		d2 = Detective("Detective 2")
		d3 = Detective("Detective 3")
		d4 = Detective("Detective 4")
		mrx = MrX("Mr. X")
		detectives = [d1, d2, d3, d4]
		game = Game(detectives, mrx, board)
		game.turn = 0

		while not game.is_over():
			print("===================================")
			game.print_positions(hide_mrx=[hide_mrx, False][game.round % 5 == 3])
			game.print_moves(hide_mrx=[hide_mrx, False][game.round % 5 == 3])
			print("===================================")

			if game.turn == 0:
				mcts = MCTS(num_iters, game)
				best_move = mcts.search(num_iters)
				if not hide_evaluations:
					mcts.print_evaluations(mcts.tree[0], best_move[0], best_move[1])
				game.make_move(game.players[0], best_move[0], best_move[1])

				game.turn = (game.turn + 1) % (len(game.players))
				continue

			game.play()

	def recreate_state(self, positions, cards, num_iters):
		board = Board("tax.txt", "bus.txt", "udg.txt", "rvr.txt")   
		d1 = Detective("Detective 1")
		d2 = Detective("Detective 2")
		d3 = Detective("Detective 3")
		d4 = Detective("Detective 4")
		mrx = MrX("Mr. X")
		detectives = [d1, d2, d3, d4]
		game = Game(detectives, mrx, board)
		game.turn = 0

		game.set_state(positions, cards, turn=0, round=11)
		print("===================================")
		game.print_positions()
		game.print_moves()
		print("===================================")
		mcts = MCTS(num_iters, game)
		mcts.search(num_iters)

def main():
	run = Playing()

	"""positions = [128, 186, 116, 55, 161]
	cards = [[4, 3, 2, 5, 2],
			[10, 8, 4, 0, 0],
			[10, 8, 4, 0, 0],
			[10, 8, 4, 0, 0],
			[10, 8, 4, 0, 0],]

	run.recreate_state(positions, cards, 50000)"""

	run.play_vs_mcts(hide_mrx=True, hide_evaluations=False)

if __name__ == '__main__':
	main()
