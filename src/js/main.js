let web3js; //for MetaMask
let abi;
let address;
let contract;
let hostAddress = "";
let guestAddress = "";

init();

function init(){
  if (typeof web3 !== 'undefined') {
    web3js = new Web3(web3.currentProvider);
    } else {
    console.log("cannot access to provider...");
    window.alert("MetaMaskに接続できません。MetaMaskをchromeにインストールしてください。");
    return;
  }
  $.ajax({
    type: "GET",
    url: "../build/contracts/CorpToken.json",
    datatype: "json"
  })
  .then(function(json){
    abi = json["abi"];
    address = json["networks"]["5777"]["address"];
  })
  .then(web3js.eth.getAccounts(function(err, accounts){
    if(err){
      console.log(err);
      return;
    }
    if (accounts.length == 0){
      console.error("cannot get accounts")
      return;
    }else{
      hostAddress = accounts;
      console.log(accounts);
    }
  })
  )
  .then(function(){
    contract = web3js.eth.contract(abi).at(address);
    console.log("contract setting complete!");
  })
}

// functions

function mintAndTransfer(_to, _eventId, _skill, _personallity, _date){
  contract.mintAndTransfer.sendTransaction(
    _to, _eventId, _skill, _personallity, _date,
    {from:hostAddress[0], gas:1000000},
    (err,res) => {
      if(!err){
        console.log("You minted new Token and transfer to "+ _to + "!");
      }else{
        console.log(err);
      }
    });
}

//return array including tokenId whose owner has.
function getToken(_owner){
  contract.getToken.call(_owner, (err,res) => {
    if(!err){
      console.log(res);
    }else{
      console.log(err);
    }
  })
}

function getDetailOfToken(_tokenId){
  contract.getDetailOfToken.call(_tokenId, (err,res) => {
    if(!err){
      console.log(res);
    }else{
      console.log(err);
    }
  })
}

