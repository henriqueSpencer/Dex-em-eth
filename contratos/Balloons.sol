// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract  Dex  is ERC20{
    /*
    Crinando um token utilizando o contrato ja validado do OpenZeppelin:
    https://docs.openzeppelin.com/contracts/4.x/api/token/erc20
    */
    constructor() ERC20("Balloons", "BAL"){
        _mint(msg.sender, 1000*10**18); //o deploy do contrato vai criar 1000 tokens de balao, *10ˆ18
    }


}