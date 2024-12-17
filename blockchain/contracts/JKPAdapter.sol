//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./JKPLibrary.sol";

import "./IJokenpo.sol";

contract JKPAdapter{

    IJokenpo private jokenpo;
    address public immutable owner;

    constructor(){
        owner = msg.sender;
    }

    function getImplementationAddress() external view returns(address){
        return address(jokenpo);
    }

    function getResult() external view upgradeRequire returns(string memory) {
        return jokenpo.getResult();
    }

     function getBid() external view restrict upgradeRequire returns(uint256){
        return jokenpo.getBid();
    }

    function getComission() external view restrict upgradeRequire returns(uint8){
        return jokenpo.getComission();
    }

    function setBid(uint256 newBid) external restrict upgradeRequire{
        return jokenpo.setBid(newBid);
    }

    function setComission(uint8 newComission) external upgradeRequire restrict{
        return jokenpo.setComission(newComission);
    }

    function upgrade(address newImplementation) external restrict{
        require(newImplementation != address(0), "Empty address is not valid");
        jokenpo = IJokenpo(newImplementation);

    }

    
    function play(JKPLibrary.Options newChoice) external payable upgradeRequire(){
        jokenpo.play{value: msg.value}(newChoice);
    }

    function getLeadersBoard() external view  upgradeRequire returns (JKPLibrary.Player[] memory){
        return jokenpo.getLeadersBoard();
    }

    modifier upgradeRequire(){
        require(address(jokenpo) != address(0), "You must upgrade first");
        _;
    }

    modifier restrict(){
        require(msg.sender == owner, "You do not have permission to do it");
        _;
    }
}
