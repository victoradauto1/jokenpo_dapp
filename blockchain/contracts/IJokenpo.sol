// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./JKPLibrary.sol";

interface IJokenpo {
   

    function getBid() external view returns (uint256);

    function getComission() external view returns (uint8);

    function setBid(uint256 newBid) external;

    function setComission(uint8 newComission) external;

    function getResult() external view returns (string memory);

    function getBalance() external view returns (uint);

    function play(JKPLibrary.Options newChoice) external payable;

    function getLeadersBoard() external view returns (JKPLibrary.Player[] memory);
}
