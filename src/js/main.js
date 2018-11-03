// variables
let web3js; //for MetaMask
let abi;
let address;
let tokenContract;
let corpTokenContract;
let userAccount = "";
let guestAddress = "";
let idToCompanyName = {"0x1dFb73D1f3117401b240d2F1879f3D1ff6948f29":"EMURGO"}

let idsTemp;

var accountInterval = setInterval(function(){
  if(web3js.eth.accounts[0] !== userAccount){
    userAccount = web3js.eth.accounts[0];
  }
},100)

var refreshTokenDetail = setInterval(function(){
  getTokenId(userAccount, getDetailOfToken_);
},1000)

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
function mintAndTransfer(){
  
  const _to = document.getElementById("_to").value;
  const _eventId = document.getElementById("_eventId").value;
  const _skill = document.getElementById("_skill").value;
  const _personality = document.getElementById("_personality").value;
  const _date = document.getElementById("_date").value;

  corpTokenContract.mintAndTransfer.sendTransaction(
    _to, _eventId, _skill, _personality, _date,
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
//function getToken(_owner, cb) {
//  response = {};
//
//  corpTokenContract.getToken(_owner, (err, res) => {
//    if(!err){
//      console.log(res);
//      response = res;
//      cb(res);
//    }else{
//      console.log(err);
//    }
//  });
//
//  return resposne;
//}

function getTokenId(_owner,callback){
  corpTokenContract.getToken(_owner, (err,res) => {
    if(!err){
      console.log(res);
      callback(res);
    }else{
      console.log(err);
    }
  })
}

function getDetailOfToken_(ids){
  if(idsTemp !== ids){
    $(".tokens").empty();
    for(id of ids){
      getDetailOfToken(id);
    }
  }
  idsTemp = ids;
}


//return the token's contents
function getDetailOfToken(_tokenId){
  corpTokenContract.getDetailOfToken(_tokenId, (err,res) => {
    if(!err){
      const _from = res[0];
      const _eventId = res[1];
      const _skill = res[2];
      const _personality = res[3];
      const _date = res[4];
      const _company = idToCompanyName[_from];
      if(_eventId == 0){

      }if(_eventId == 2){
        $(".tokens").append(`<div class="token">
          <ul>
            <li div class="skill"> Skill: ${_skill} </li>
            <li div class="personality"> Personality: ${_personality} </li>
            <li div class="date"> Date: ${_date} </li>
            <li div class="company"> Company: ${_company} </li>
            <li div class="event"> Event: ${_eventId} </li>
          </ul>
        </div>`);
      }

      //document.getElementById("corpToken-eventId").textContent = _eventId;
      //document.getElementById("corpToken-skill").textContent = _skill;
      //document.getElementById("corpToken-personality").textContent = _personality;
      //document.getElementById("corpToken-date").textContent = _date;
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