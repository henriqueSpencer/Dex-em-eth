

// ENDEREÇO EHTEREUM DO CONTRATO
var contractAddress = "0xAFAF85C90cc1D228254cC058B3B568C24F0F2C2D";

// Inicializa o objeto DApp
document.addEventListener("DOMContentLoaded", onDocumentLoad);
function onDocumentLoad() {
  DApp.init();
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
  return DApp.contracts.Dex.methods.equivalenteEth().call({ qtdEth:qtdEth });
}
function equivalenteToken(qtdEth){
  return DApp.contracts.Dex.methods.equivalenteToken().call({ qtdToken:qtdToken });
}
function PoolEth(){
  return DApp.contracts.Dex.methods.PoolEth().call({ qtdToken:qtdToken });
}
function PoolTokens(){
  return DApp.contracts.Dex.methods.PoolTokens().call({ qtdToken:qtdToken });
}

//ethToToken()
//tokenToEth(uint256 tokens)



$("#quantidade").on('input', function () { //esse é para pegar os dados do cliente selecionado
    var valor = $('#quantidade').val();
    console.log(valor);
    if(document.getElementById('radio_eth').checked) {
      var cotacao = equivalenteToken(valor);
      console.log(cotacao);
    }else if(document.getElementById('radio_token').checked) {
      var cotacao = equivalenteEth(valor);
      console.log(cotacao);

    }

});










