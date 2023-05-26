import copy
from constants import *
from board import Board
from player import Detective, MrX


class Game():
	def __init__(self, detectives, mrx, board):
		self.detectives = detectives
		self.mrx = mrx
		self.players = [mrx] + detectives
		self.board = board
		self.turn = 0
		self.round = 1
		
	def set_state(self, positions, cards, turn, round):
		for ind, player in enumerate(self.players):
			player.position = positions[ind]
			for i in range (4):
				player.cards[i] = cards[ind][i]
		self.turn = turn
		self.round = round
	
	def is_over(self):
		if self.round >= MAX_ROUNDS:
			return True
		
		for self.detective in self.detectives:
			if self.detective.position == self.mrx.position:
				return True
		return False
	
	def print_positions(self, hide_mrx=False):
		for player in self.players:
			if hide_mrx and isinstance(player, MrX):
				continue
			print(f"{player.name} position: {player.position}")
	
	def print_moves(self, hide_mrx=False):
		print("Moves: [TAX, BUS, UDG, RVR, X2]")
		player = self.players[self.turn]
		if isinstance(player, MrX) and hide_mrx:
			return
		print(f"{player.name} possible moves: {self.get_legal_moves(player)}, cards: {player.cards}")
		pass
	
	def get_legal_moves(self, player):
		tax = self.get_moves_by_vehicle(player, 0)
		bus = self.get_moves_by_vehicle(player, 1)
		udg = self.get_moves_by_vehicle(player, 2)
		rvr = []
		if isinstance(player, MrX) and player.cards[3] != 0:
			rvr = self.get_moves_by_vehicle(player, 3)
			rvr = list(set(tax + bus + udg + rvr))
		moves = [tax, bus, udg, rvr]
		return moves

	def get_moves_by_vehicle(self, player, vehicle_idx, position=None):
		if player.cards[vehicle_idx] == 0:
			return []
		position = player.position
		legal_moves = self.board.legal_moves[position][vehicle_idx]
		detectives_positions = [detective.position for detective in self.detectives]
		legal_moves = [move for move in legal_moves if not move in detectives_positions]
		return legal_moves
		
	def make_move(self, player, vehicle, position):
		moves = self.get_moves_by_vehicle(player, vehicle)
		if position in moves:
			player.move(vehicle, position)
			if isinstance(player, Detective):
				self.mrx.cards[vehicle] += 1
		else:
			print(moves)
			print(player.cards)
			print(self.get_moves_by_vehicle(player, vehicle))
			print(player.position)
			print(self.board.legal_moves)
			raise Exception(f"{idx_to_vehicle[vehicle]} {position} is not a legal move for {player.name}!")

	def play(self):
		player = self.players[self.turn]
		if (sum(player.cards) == 0):
			return

		## nacin inputa -> "vrsta transportacije" "nova pozicija"
		## npr: TAX 1
		player_move = input(f"{player.name} move: ")

		[vehicle, position] = player_move.split()
		position = int(position)
		vehicle = vehicle_to_idx[vehicle]
		self.make_move(player, vehicle, position)

		self.turn += 1
		self.turn %= len(self.players)
		if (self.turn == 0):
			self.round += 1


def main():
	board = Board("tax.txt", "bus.txt", "udg.txt", "rvr.txt")

	d1 = Detective("Detective 1")
	d2 = Detective("Detective 2")
	mrx = MrX("Mr. X")
	detectives = [d1, d2]
	
	game = Game(detectives, mrx, board)

	while not game.is_over():
		print()
		game.print_positions()
		
		game.print_moves()
		
		game.play()
	print("\nGAME OVER\n")
	if (game.round >= MAX_ROUNDS):
		print("Mr. X wins!")
	else:
		print("Detectives win!")
	exit()


if __name__ == "__main__":
	main()
