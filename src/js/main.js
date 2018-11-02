// variables
let web3js; //for MetaMask
let abi;
let address;
let tokenContract;
let corpTokenContract;
let userAccount = "";
let guestAddress = "";

var accountInterval = setInterval(function(){
  if(web3js.eth.accounts[0] !== userAccount){
    userAccount = web3js.eth.accounts[0];
  }
},100)


init();

// defining function
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
      userAccount = accounts;
      console.log(accounts);
    }
  })
  )
  .then(function(){
    corpTokenContract = web3js.eth.contract(abi).at(address);
    console.log("CorpToken.sol setting complete!");
  })
  $.ajax({
    type: "GET",
    url: "../build/contracts/Token.json",
    datatype: "json"
  })
  .then(function(json){
    abi = json["abi"];
    address = json["networks"]["5777"]["address"];
  })
  .then(function(){
    tokenContract = web3js.eth.contract(abi).at(address);
    console.log("Token.sol setting complete!")
  })
}


// Functions based on CorpToken.sol
// mintAndTransfer
function mintAndTransfer(_to, _eventId, _skill, _personallity, _date){
  corpTokenContract.mintAndTransfer.sendTransaction(
    _to, _eventId, _skill, _personallity, _date,
    {from:userAccount, gas:1000000},
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
  corpTokenContract.getToken.call(_owner, (err,res) => {
    if(!err){
      console.log(res);
    }else{
      console.log(err);
    }
  })
}

//return the token's contents
function getDetailOfToken(_tokenId){
  corpTokenContract.getDetailOfToken.call(_tokenId, (err,res) => {
    if(!err){
      console.log(res);
    }else{
      console.log(err);
    }
  })
}


// Functions based on Token.sol

function mintAndTransfer_USER(_to, _skill, _personality){
  tokenContract.mintAndTransfer_USER.sendTransaction(
    _to, _skill, _personality,
    {from: userAccount, gas: 1000000},
    (err,res) => {
      if(!err){
        console.log("You minted new UserToken and transfer it to "+ _to + "!");
      }else{
        console.log(err);
      }
    }
  )
}


function getToken_USER(_owner){
  tokenContract.getToken_USER(_owner, function(err,res){
    if(!err){
      //console.log(result + "is TokenId");
      //return result[0];
      console.log(res);
    }else{
      console.log(err);
    }
  })
}

function getDetailOfToken_USER(_tokenId){
  tokenContract.getDetailOfToken_USER(_tokenId, function(err,result){
    if(!err){
      let resSkill = result[0]["c"][0];
      let resPersonality = result[1]["c"][0];
      console.log("skill is "+ resSkill + ", personallity is " + resPersonality);
      return resSkill, resPersonality;
    }else{
      console.log(err);
    }
  })
}

function getTotalSkill(_owner){
  let _tokenIds = getToken_USER(_owner);
  let totalSkill = 0;
  let totalPersonality = 0;

  for(let i of _tokenIds){
    totalSkill, totalPersonality += getDetailOfToken_USER(i);
  }
  console.log(totalSkill, totalPersonality);
}