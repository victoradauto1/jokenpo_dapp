// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Jokenpo {
    enum Options { NONE, ROCK, PAPER, SCISSOR }

    Options private choice1 = Options.NONE;
    Options private choice2 = Options.NONE;
    address private player1;
    address private player2;
    string private result;
    uint256 private bid = 0.01 ether;
    uint8 private comission = 10;//percent

    address payable private immutable owner;

    Player[] public winners;

    struct Player{
        address wallet;
        uint32 wins;
    }

    constructor(){
        owner = payable(msg.sender);
    }

    function getBid() external view returns(uint256){
        return bid;
    }

    function getComission() external view returns(uint8){
        return comission;
    }

    function setBid(uint256 newBid) external{
        require(msg.sender == owner, "You do not have permission to do it");
        require(player1 == address(0), "You can not change the bid with a game in progress");
        bid = newBid;
    }

    function setComission(uint8 newComission) external{
        require(msg.sender == owner, "You do not have permission to do it");
        require(player1 == address(0), "You can not change the comission with a game in progress");
        comission = newComission;
    }

    function getResult() external view returns(string memory) {
        return result;
    }

   function updateWinner(address winner) private {
        for (uint i = 0; i < winners.length; i++) {
            
            if (winners[i].wallet == winner) {
                winners[i].wins++;                 
            }
        }

        winners.push(Player(winner, 1));
    }

    function getBallance() public view returns(uint) {
        require(msg.sender == owner, "Not alowed");
        return address(this).balance;
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer(contractAddress.balance / 100 * (100 - comission));
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        player2 = address(0);
        choice1 = Options.NONE;
        choice2 = Options.NONE;
    }


    function play(Options newChoice) external payable {
        require(msg.sender != owner, "The owner can not play");
        require(newChoice != Options.NONE, "Invalid choice");
        require(msg.value >= bid, "Invalid bid");

        // Caso 1: Primeiro jogador faz a escolha
        if (player1 == address(0)) {
            player1 = msg.sender;
            choice1 = newChoice;
            result = "Player 1 chooses an option. Waiting for Player 2.";
            return;
        }

        // Caso 2: Segundo jogador faz a escolha
        if (player2 == address(0) && msg.sender != player1) {
            player2 = msg.sender;
            choice2 = newChoice;

            // Avalia o resultado do jogo
            if (choice1 == Options.ROCK && choice2 == Options.SCISSOR) {
                finishGame("Rock breaks scissor, Player 1 won.", player1);
            } else if (choice1 == Options.PAPER && choice2 == Options.ROCK) {
                finishGame("Paper covers the Rock, Player 1 won.", player1);
            } else if (choice1 == Options.SCISSOR && choice2 == Options.PAPER) {
                finishGame("Scissor cuts the paper, Player 1 won.", player1);
            } else if (choice1 == Options.SCISSOR && choice2 == Options.ROCK) {
                finishGame("Rock breaks scissor, Player 2 won.", player2);
            } else if (choice1 == Options.ROCK && choice2 == Options.PAPER) {
                finishGame("Paper covers the Rock, Player 2 won.", player2);
            } else if (choice1 == Options.PAPER && choice2 == Options.SCISSOR) {
                finishGame("Scissor cuts the paper, Player 2 won.", player2);
            } else {
                player1 = address(0);
                choice1 = Options.NONE;
                result = "Draw Game, the prie was doubled.";
            }
            return;
        }

        // Caso 3: Impede o mesmo jogador de jogar novamente
        require(msg.sender != player1 && msg.sender != player2, "You have already played");
    }

    function getLeadersBoard() external view returns(Player[] memory){
        if(winners.length < 2) return winners;

        Player[] memory arr = new Player[](winners.length);
        for(uint i=0; i < winners.length; i++){
            arr[i] = winners[i];
        }

    for(uint i=0; i < arr.length; i++){
        for(uint j=0; j < arr.length; j++){
            if(arr[i].wins < arr[j].wins){
                Player memory change = arr[i];
                arr[i] = arr[j];
                arr[j] = change;
            }
        }
    }
        return arr;
    }
}
