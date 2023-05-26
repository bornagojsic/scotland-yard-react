import numpy as np
from constants import *
from board import Board
from player import Detective, MrX
from game import Game
from simulation import Simulation
from copy import deepcopy

NUM_ITERS = 10000

class Node():

    def __init__(self, game, ind, parent_ind, parent_move):

        ##################################### Stores the gamestate ###################################################
        self.positions = [player.position for player in game.players]
        self.cards = [player.cards[:] for player in game.players] #Deepcopy of card lists
        self.player = game.players[game.turn]
        self.turn = game.turn
        self.round = game.round
        self.is_terminal = game.is_over()
        ##############################################################################################################

        self.wins = 0
        self.visits = 0

        self.ind = ind #Index of the node in the game tree (MCTS.tree is an array of nodes)
        self.parent_ind = parent_ind
        self.parent_move = parent_move
        
        self.legal_moves = game.get_legal_moves(player=game.players[game.turn])
        self.flattened_moves = [[i, j] for i in range(len(self.legal_moves)) for j in self.legal_moves[i]]
        self.num_of_legal_moves = len(self.flattened_moves)
        self.children = [] #Stores indices (in MCTS.tree) of children 
        self.has_children = False

        self.nodes_expanded = 0
        self.all_expanded = not(self.num_of_legal_moves) #If a node has no possible children, then it's fully expanded

class MCTS():

    def __init__(self, num_iters, gamestate):
        self.tree = [0] * (num_iters + 1) #Tree is initialized as an array of ints to avoid appending
        self.max_ind = 0 #Index of the last created node in the tree
        self.game = deepcopy(gamestate) #Deepcopy of the gamestate which will then be updated when neccessary
        self.sim = Simulation()

    def UCB1(self, node): #Calculates UCT score for each child, formula can be found online (MCTS wikipedia - selection)
        ret = []
        for ind in node.children: 
            temp = self.tree[ind]
            if temp.visits == 0:
                ret.append(123456789) #inf if never visited
                continue
            wr = temp.wins/temp.visits #Mr.x. wins
            if node.turn != 0: #Detectives are minimizing agents!
                wr = 1 - wr
            ret.append(wr + C_PARAMETER * (np.log(node.visits) / temp.visits) ) #UCT formula
        return ret

    def selection(self, node): #Descends down the tree according to UCT until it reaches
        while True:            # a leaf node
            if not node.all_expanded:
                return node
            if node.has_children:
                selected_ind = np.argmax(self.UCB1(node)) #Index of max value
                node = self.tree[node.children[selected_ind]] #Selects the best child and descends one level down
                continue
            break
        return node

    def expansion(self, node): #Creates a new node from the selected node (which we got to by MCTS.selection)
        if node.is_terminal:
            return
        if not node.all_expanded:
            self.game.set_state(node.positions, node.cards, node.turn, node.round) #Sets game state to the one remembered 
                                                                                   #by the node

            vehicle = node.flattened_moves[node.nodes_expanded][0]
            position = node.flattened_moves[node.nodes_expanded][1]
            self.game.make_move(node.player, vehicle, position)
            self.game.turn = (self.game.turn + 1) % len(self.game.players)

            self.max_ind += 1
            child = Node(self.game, self.max_ind, node.ind, [vehicle, position]) #creates the child node
            self.tree[self.max_ind] = child
            node.children.append(child.ind)
            node.nodes_expanded += 1
            node.has_children = True
            if node.nodes_expanded == node.num_of_legal_moves:
                node.all_expanded = True

    def simulation(self, node):
        self.sim.det_wins = 0
        self.sim.mrx_wins = 0
        self.game.set_state(node.positions, node.cards, node.turn, node.round) #Sets game state to the one remembered in the node
        
        self.sim.simulate_game(self.game)

        if self.sim.det_wins > 0: #Detectives won -> 0
            return 0
        if self.sim.mrx_wins > 0: #Model won -> 1
            return 1

    def backpropagation(self, node, result): #Updates the weights of the simulated path
        node.visits += 1
        node.wins += result
        
        if node.ind == 0:
            return
        self.backpropagation(self.tree[node.parent_ind], result)

    def create_root_node(self): #Self-explanatory
        self.tree[0] = Node(self.game, 0, None, None)
        self.tree[0].visits = 1

    def print_evaluations(self, node, vehicle, position): #Prints it out like a nice table
        visits = [self.tree[x].visits for x in node.children]
        wins = [self.tree[x].wins for x in node.children]

        print(f"{'Move':^10}{'Visits':>10}{'Winrate':>10}")
        for i, move in enumerate(node.flattened_moves):
            print(f"{idx_to_vehicle[move[0]]:5}{move[1]:5d}{visits[i]:10d}{wins[i]/visits[i]:10f}")

        print("Best move:", idx_to_vehicle[vehicle], position)

    def search(self, num_iters): # Oh yeah, it's all coming together
        self.create_root_node()
        node = self.tree[0]
        for _ in range (num_iters):
            node = self.selection(self.tree[0])
            self.expansion(node)
            node = self.selection(node)
            result = self.simulation(node)
            self.backpropagation(node, result)
        node = self.tree[0]
        
        weights = [self.tree[x].visits for x in node.children]
        weights2 = [self.tree[x].wins for x in node.children]
        
        node = self.tree[node.children[np.argmax(weights)]] #Selects the most-visited child
        vehicle = node.parent_move[0]
        position = node.parent_move[1]
        return [vehicle, position]
        

def main():
    board = Board("tax.txt", "bus.txt", "udg.txt", "rvr.txt")   
    d1 = Detective("Detective 1")
    d2 = Detective("Detective 2")
    mrx = MrX("Mr. X")
    detectives = [d1, d2]
    game = Game(detectives, mrx, board)
    game.turn = 0
    mcts = MCTS(NUM_ITERS, game)
    mcts.create_root_node()
    mcts.search(NUM_ITERS)

if __name__ == '__main__':
    main()
