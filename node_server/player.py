from random import random
from copy import deepcopy
from constants import *

starting_positions = [103, 112, 34, 155, 94, 117, 132, 53, 174, 198, 50, 91, 26, 29, 141, 13, 138, 197]

class Player():
	def __init__(self, name="", starting_position=None):
		self.name = name
		if starting_position is None:
			self.set_starting_position()
		else:
			self.positions = [starting_position]
		self.set_starting_position()
		## kartice su redom TAX, BUS, UDG, RVR
		self.cards = [0] * 4
		self.set_cards()
	
	def move(self, vehicle, position):
		self.position = position
		self.cards[vehicle] -= 1

	def set_starting_position(self):
		self.position = starting_positions[int(random() * len(starting_positions))]
	
	def set_cards(self):
		if isinstance(self, Detective):
			self.cards = deepcopy(DETECTIVE_CARDS)
		else:
			self.cards = deepcopy(MRX_CARDS)

	def reset(self):
		self.set_starting_position()
		self.set_cards()
		


class Detective(Player):
	def __init__(self, name="", starting_position=None):
		super(Detective, self).__init__(name, starting_position)


class MrX(Player):
	def __init__(self, name="", starting_position=None):
		super(MrX, self).__init__(name, starting_position)

def main():
	d1 = Detective()
	mrx = MrX()
	print(d1.position, mrx.position, starting_positions)
	print(d1.cards, mrx.cards)


if __name__ == '__main__':
	main()
