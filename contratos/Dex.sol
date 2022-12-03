// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

//import "hardhat/console.sol";

import "../Owned.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract  Dex  is Mortal{
    /*
    Fontes:
    -https://medium.com/@austin_48503/%EF%B8%8F-minimum-viable-exchange-d84f30bd0c90
    -https://www.youtube.com/watch?v=wFhhHkYM_9Q
    */

    using SafeMath for uint256;
    IERC20 token;

    //qtd de eth no pool
    uint256 public totalLiquidity; // Liqidez total do pool
    mapping (address => uint256) public liquidity; // a liquidez dada por cada endereço

    constructor(address token_addr) {
        token = IERC20(token_addr);
    }

    //Serve so para dar a liquidez inicial do pool
    function init(uint256 tokens) public payable returns (uint256) {
        require(totalLiquidity==0, "DEX:init - already has liquidity");
        totalLiquidity = address(this).balance;
        liquidity[msg.sender] = totalLiquidity;
        require(token.transferFrom(msg.sender, address(this), tokens));
        return totalLiquidity;
    }

    /*
    AMM:
        -Bonding curve
        -Constant Product
            x * y = k
            TokenA * TokenB = k
            (TokenA + InputA) * (TokenB - outPutB) = k
            Quando voce dar a ele vai ter que te devolver b para o k ficar constante
            se tiver taxa o k vai ficar sempre aumentando

            Com Fee:
            comprando y:
                x*y=k
                (x+a)*(y-b)=x*y
                b=(y*a)/(x+a)
    */
    function price(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) public view returns (uint256) {
        //Ex: trocando A -> B
        //input_amount = Qtd de A que voce esta vendendo
        //input_reserve = Total A na DEX
        //output_reserve = Total de B na Dex
        uint256 input_amount_with_fee = input_amount.mul(997);// não é 1000 pq tem uma taxa de 0.3%
        uint256 numerator = input_amount_with_fee.mul(output_reserve);
        uint256 denominator = input_reserve.mul(1000).add(input_amount_with_fee);
        return numerator / denominator;
        // a*997*y           997    a*y
        // -------         = ---  * ---  = b
        // x*1000 + a*997    1000  (x+a)
    }

    // trade ether for tokens
    function ethToToken() public payable returns (uint256) {
        uint256 token_reserve = token.balanceOf(address(this));// qtd de tokens da DEX
        //                            ValorEnviado(ETH) | balanco-valorEnviado(ETH) |  qtd de tokens da DEX
        uint256 tokens_bought = price(msg.value, address(this).balance.sub(msg.value), token_reserve);// qtd de tokens comprados
        require(token.transfer(msg.sender, tokens_bought));//enviando os tokens
        return tokens_bought;
    }

    // trade tokens for ether
    function tokenToEth(uint256 tokens) public returns (uint256) {
        //requerido que ele tenha no seu balanço os tokens
        require(token.balanceOf(msg.sender) > tokens);
        uint256 token_reserve = token.balanceOf(address(this));
        //                        ValorEnviado(toks) | balanco(toks) |  qtd de ETH da DEX
        uint256 eth_bought = price(tokens, token_reserve, address(this).balance);
        payable(msg.sender).transfer(eth_bought); //Pagando
        require(token.transferFrom(msg.sender, address(this), tokens)); //transfere os tokens do cliente para a dex
        return eth_bought;
    }

    //para depositar em uma liquidity poll tem que ser na mesma proporção que ja esta
    /*

    */
    function deposit() public payable returns (uint256) {
        //Eth na DEX sem o deposito
        uint256 eth_reserve = address(this).balance.sub(msg.value);
        //Token na DEX
        uint256 token_reserve = token.balanceOf(address(this));
        // qtd de token q ele vai ter q transferir
        uint256 token_amount = (msg.value.mul(token_reserve) / eth_reserve).add(1); //pq add 1 ?
        //add para a liquidez
        //x1 * X * Y / X  = % de acrescimo de x * pool atual = so ao acrescimo do pool
        uint256 liquidity_minted = msg.value.mul(totalLiquidity) / eth_reserve;
        //salvando quanto o sender enviou
        liquidity[msg.sender] = liquidity[msg.sender].add(liquidity_minted);
        // add o acrescimento de liquidez a liquidez total
        totalLiquidity = totalLiquidity.add(liquidity_minted);
        //transferencia dos tokens
        require(token.transferFrom(msg.sender, address(this), token_amount));
        return liquidity_minted;
    }

    function withdraw(uint256 amount) public returns (uint256, uint256) {
        //Token na DEX
        uint256 token_reserve = token.balanceOf(address(this));
        //valor requerido(ETH) * balanço(ETH) / liquidezTotal
        uint256 eth_amount = amount.mul(address(this).balance) / totalLiquidity;

        uint256 token_amount = amount.mul(token_reserve) / totalLiquidity;

        liquidity[msg.sender] = liquidity[msg.sender].sub(eth_amount);

        totalLiquidity = totalLiquidity.sub(eth_amount);
        //msg.sender.transfer(eth_amount);
        payable(msg.sender).transfer(eth_amount);
        require(token.transfer(msg.sender, token_amount));
        return (eth_amount, token_amount);
    }

}