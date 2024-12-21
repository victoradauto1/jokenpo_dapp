// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./JKPLibrary.sol";
import "./IJokenpo.sol";

contract Jokenpo is IJokenpo {
    JKPLibrary.Options private choice1 = JKPLibrary.Options.NONE;
    JKPLibrary.Options private choice2 = JKPLibrary.Options.NONE;
    address private player1;
    address private player2;
    string private result;
    uint256 private bid = 0.01 ether;
    uint8 private comission = 10; //percent

    address payable private immutable owner;

    JKPLibrary.Player[] public winners;

    constructor() {
        owner = payable(msg.sender);
    }

    function getBid() external view returns (uint256) {
        return bid;
    }

    function getComission() external view returns (uint8) {
        return comission;
    }

    function setBid(uint256 newBid) external {
        require(tx.origin == owner, "You do not have permission to do it");
        require(
            player1 == address(0),
            "You can not change the bid with a game in progress"
        );
        bid = newBid;
    }

    function setComission(uint8 newComission) external {
        require(tx.origin == owner, "You do not have permission to do it");
        require(
            player1 == address(0),
            "You can not change the comission with a game in progress"
        );
        comission = newComission;
    }

    function getResult() external view returns (string memory) {
        return result;
    }

    function updateWinner(address winner) private {

    for (uint i = 0; i < winners.length; i++) {
        if (winners[i].wallet == winner) {
            winners[i].wins++;
            return;                 
        }
    }

    winners.push(JKPLibrary.Player(winner, 1));
}

    function getBalance() external view returns (uint) {
        require(tx.origin == owner, "Not alowed");
        return address(this).balance;
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer(
            (contractAddress.balance / 100) * (100 - comission)
        );
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        player2 = address(0);
        choice1 = JKPLibrary.Options.NONE;
        choice2 = JKPLibrary.Options.NONE;
    }

    function play(
        JKPLibrary.Options newChoice
    ) external payable returns (string memory) {
        require(tx.origin != owner, "The owner can not play");
        require(newChoice != JKPLibrary.Options.NONE, "Invalid choice");
        require(msg.value >= bid, "Invalid bid");
        require(
            tx.origin != player1 && tx.origin != player2,
            "You have already played"
        );

        if (player1 == address(0)) {
            player1 = tx.origin;
            choice1 = newChoice;
            result = "Player 1 chooses an option. Waiting for Player 2.";
            return result;
        }

        if (player2 == address(0) && tx.origin != player1) {
            player2 = tx.origin;
            choice2 = newChoice;

            if (
                choice1 == JKPLibrary.Options.ROCK &&
                choice2 == JKPLibrary.Options.SCISSOR
            ) {
                finishGame("Rock breaks scissor, Player 1 won.", player1);
            } else if (
                choice1 == JKPLibrary.Options.PAPER &&
                choice2 == JKPLibrary.Options.ROCK
            ) {
                finishGame("Paper covers the Rock, Player 1 won.", player1);
            } else if (
                choice1 == JKPLibrary.Options.SCISSOR &&
                choice2 == JKPLibrary.Options.PAPER
            ) {
                finishGame("Scissor cuts the paper, Player 1 won.", player1);
            } else if (
                choice1 == JKPLibrary.Options.SCISSOR &&
                choice2 == JKPLibrary.Options.ROCK
            ) {
                finishGame("Rock breaks scissor, Player 2 won.", player2);
            } else if (
                choice1 == JKPLibrary.Options.ROCK &&
                choice2 == JKPLibrary.Options.PAPER
            ) {
                finishGame("Paper covers the Rock, Player 2 won.", player2);
            } else if (
                choice1 == JKPLibrary.Options.PAPER &&
                choice2 == JKPLibrary.Options.SCISSOR
            ) {
                finishGame("Scissor cuts the paper, Player 2 won.", player2);
            } else {
                bid = bid * 2;
                player1 = address(0);
                choice1 = JKPLibrary.Options.NONE;
                player2 = address(0);
                choice2 = JKPLibrary.Options.NONE;
                result = "Draw Game, the price was doubled.";
            }
            return result;
        }

        return "Invalid game state";
    }

    function getLeadersBoard()
        external
        view
        returns (JKPLibrary.Player[] memory)
    {
        if (winners.length < 2) return winners;

        JKPLibrary.Player[] memory arr = new JKPLibrary.Player[](
            winners.length
        );
        for (uint i = 0; i < winners.length; i++) {
            arr[i] = winners[i];
        }

        for (uint i = 0; i < arr.length; i++) {
            for (uint j = 0; j < arr.length; j++) {
                if (arr[i].wins < arr[j].wins) {
                    JKPLibrary.Player memory change = arr[i];
                    arr[i] = arr[j];
                    arr[j] = change;
                }
            }
        }
        return arr;
    }
}
