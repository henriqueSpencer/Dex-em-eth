// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract Owned {
    address payable owner;

    constructor()  {
        owner = payable(msg.sender);
    }

    modifier onlyOwner{
        require(msg.sender == owner, "Somente o dono do contrato pode chamar essa Funcao");
        _; // Qualquer função que tiver esse modificador primeiro vai fazer essa verificação e dps executar o que tem dentro dela
    }
    function changeOwner(address payable newOwner) public onlyOwner {
        owner = newOwner;
    }

    function getOwner() external view returns (address) {
        return owner;
    }


}

contract Mortal is Owned{
    function destroy() public onlyOwner{ // add o modificador nela
        selfdestruct(owner);
    }
}