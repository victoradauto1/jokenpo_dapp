//SPDX-License-Identifier: MIT

pragma solidity ^0.8.28;

library JKPLibrary{
     enum Options {
        NONE,
        ROCK,
        PAPER,
        SCISSOR
    }

    struct Player {
        address wallet;
        uint32 wins;
    }
}