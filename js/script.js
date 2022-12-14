

// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0x80FE73c72D1E9c1F90F96AadFfD0cE2380E368D6";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
  DApp.init().then((result) => {
        atualiza_tela();
      });

}

// Nosso objeto DApp que irá armazenar a instância web3
const DApp = {
  web3: null,
  contracts: {},
  account: null,

  init: function () {
    return DApp.initWeb3();
  },

  // Inicializa o provedor web3
  initWeb3: async function () {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({ // Requisita primeiro acesso ao Metamask
          method: "eth_requestAccounts",
        });
        DApp.account = accounts[0];
        window.ethereum.on('accountsChanged', DApp.updateAccount); // Atualiza se o usuário trcar de conta no Metamaslk
      } catch (error) {
        console.error("Usuário negou acesso ao web3!");
        return;
      }
      DApp.web3 = new Web3(window.ethereum);
    } else {
      console.error("Instalar MetaMask!");
      return;
    }
    return DApp.initContract();
  },

  // Atualiza 'DApp.account' para a conta ativa no Metamask
  updateAccount: async function() {
    DApp.account = (await DApp.web3.eth.getAccounts())[0];
    //atualizaInterface();
  },

  // Associa ao endereço do seu contrato
  initContract: async function () {
    DApp.contracts.Dex = new DApp.web3.eth.Contract(abi, contractAddress);
    return DApp.render();
  },

  // Inicializa a interface HTML com os dados obtidos
  render: async function () {
    //inicializaInterface();
    console.log('OLA');
  },

};

//--------------------- Metodos de Consulta ----------------------//

function equivalenteEth(qtdToken){
  return DApp.contracts.Dex.methods.equivalenteEth(qtdToken).call({ qtdToken:qtdToken });
}
function equivalenteToken(qtdEth){
  return DApp.contracts.Dex.methods.equivalenteToken(qtdEth).call({ qtdEth:qtdEth });
}
// QTD DE ETH NO POOL
function PoolEth(){
  return DApp.contracts.Dex.methods.PoolEth().call();
}
// QTD DE TOKENS NO POOL
function PoolTokens(){
  return DApp.contracts.Dex.methods.PoolTokens().call();
}
function comprarETH(qtdToken) {
  //let quant = document.getElementById("quantidade").value;
  //let preco = 1000000000000000 * quant;
  //qtdToken = document.getElementById('token_qtd').innerHTML;
  return DApp.contracts.Dex.methods.tokenToEth(qtdToken).send({ from: DApp.account, tokens: qtdToken }).then(atualiza_tela);
}
function comprarToken(valor_eth) {
  //let quant = document.getElementById("quantidade").value;
  //let preco = 1000000000000000 * quant;
  //valor_eth = document.getElementById('eth_qtd').innerHTML;
  return DApp.contracts.Dex.methods.ethToToken().send({ from: DApp.account, value: valor_eth }).then(atualiza_tela);
}

//ethToToken()
//tokenToEth(uint256 tokens)
// $(document).ready(function () {
//     atualiza_tela();
// });

//FUNCAO ATUALIZA QTD DE TOKENS
function atualiza_tela() {
  //qtd_tokens = PoolTokens();
  PoolTokens().then((result) => {
    console.log(result);
    document.getElementById('pool_tokens').innerHTML = result;
  });
  PoolEth().then((result) => {
    console.log(result);
    document.getElementById('pool_eth').innerHTML = result;
  });

}
//FUNCAOATUALIZA QTD ETH


//FUNCAO PEGA COTACAO
$("#quantidade").on('input', function () { //esse é para pegar os dados do cliente selecionado
    console.log('PEGA COTACAO');
    atualiza_tela();
    var valor = $('#quantidade').val();
    console.log(valor);
    if(document.getElementById('radio_eth').checked) {
      console.log('ETH SELECIONADO');
      var cotacao = equivalenteToken(valor);
      equivalenteToken(valor).then((result) => {
        document.getElementById('eth_qtd').innerHTML = valor;
        document.getElementById('token_qtd').innerHTML = result;
        //eth_qtd
        //token_qtd
      });
      console.log(cotacao);
    }else if(document.getElementById('radio_token').checked) {
      console.log('TOKEN SELECIONADO');
      var cotacao = equivalenteEth(valor);
      equivalenteEth(valor).then((result) => {
        document.getElementById('token_qtd').innerHTML = valor;
        document.getElementById('eth_qtd').innerHTML = result;
        //eth_qtd
        //token_qtd
      });
      console.log(cotacao);

    }

});

//FUNCAO COMPRA
$('#btnComprar').on('click', function () {
    console.log('FUNCAO COMPRA');
    var valor = $('#quantidade').val();
    console.log(valor);
    if(document.getElementById('radio_eth').checked) {
      console.log('ETH');
      equivalenteToken(valor).then((result) => {
        console.log(result);
        comprarETH(result);
      });

    }else if(document.getElementById('radio_token').checked) {
      console.log('TOKEN SELECIONADO');
      equivalenteEth(valor).then((result) => {
        console.log(result);
        comprarToken(result);
      });

    }
});







