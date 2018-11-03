// variables
let web3js; //for MetaMask
let abi;
let address;
let tokenContract;
let corpTokenContract;
let userAccount = "";
let guestAddress = "";
let idToCompanyName = {"0x1dfb73d1f3117401b240d2f1879f3d1ff6948f29":"EMURGO"}

let before;


// setIntervals
var accountInterval = setInterval(function(){
  $(".address").text(userAccount);
  if(web3js.eth.accounts[0] !== userAccount){
    userAccount = web3js.eth.accounts[0];
  };
},100);

var refreshTokenDetail = setInterval(function(){
  getTokenId("0xE624B1e717466a13869Be9dbb7c3e4637a88B01E", getDetailOfToken_);
},500);



// Initialize
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
  });
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


// getting CorpTokenId
function getTokenId(_owner,callback){
  corpTokenContract.getToken(_owner, (err,res) => {
    if(!err){
      callback(res);
    }else{
      console.log(err);
    }
  })
}

// To repeat getDetailOfToken
function getDetailOfToken_(ids){
  console.log(ids.length !== before);
  if(ids.length !== before){
    $(".tokens").empty();
    for(id of ids){
      getDetailOfToken(id);
    };
  }
  before = ids.length;
}


//return UserToken property
function getDetailOfToken(_tokenId){
  corpTokenContract.getDetailOfToken(_tokenId, (err,res) => {
    if(!err){
      let _from = res[0];
      let _eventId = res[1];
      let _skill = res[2];
      let _personality = res[3];
      let _date = res[4];
      let _company = idToCompanyName[_from];
      console.log(_from, _company);
      if(_eventId == 2){
        $(".tokens").append(`<div class="token">
          <ul>
            <li div class="skill"> Skill: ${_skill} </li>
            <li div class="personality"> Personality: ${_personality} </li>
            <li div class="date"> Date: ${_date} </li>
            <li div class="company"> Company: ${_company} </li>
            <li div class="event"> Event: ${_eventId} </li>
          </ul>
        </div>`);
        console.log("append は遠てる")
      }else{
        console.log("eventId error")
      }
      //document.getElementById("corpToken-eventId").textContent = _eventId;
      //document.getElementById("corpToken-skill").textContent = _skill;
      //document.getElementById("corpToken-personality").textContent = _personality;
      //document.getElementById("corpToken-date").textContent = _date;
    }else{
      console.log(err);
    };
  });
}

// Functions based on Token.sol

function mintAndTransfer_USER(){
  const _to = document.getElementById("_toUSER").value;
  const _skill = document.getElementById("_skillUSER").value;
  const _personality = document.getElementById("_personalityUSER").value;

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


function getTokenId_USER(_owner, callback){
  tokenContract.getToken_USER(_owner, (err,res) => {
    if(!err){
      console.log(res);
      callback(res);
    }else{
      console.log(err);
    }
  });
}

function getDetailOfToken_USER(ids){
  let totalSkill = 0;
  let totalPersonality = 0;
  let _skill = 0;
  let _personality = 0;
  console.log(ids);

  for(id of ids){
    id_ = id["c"][0];
    tokenContract.getDetailOfToken_USER(id_, (err,res) => {
      if(!err){
        console.log("res"+ res);

        _skill = res[0]["c"][0];
        _personality = res[1]["c"][0];

        console.log(" for " + _skill,_personality);

        totalSkill += _skill;
        totalPersonality += _personality;
      }else{
        console.log(err);
      }
    });
  };

  console.log("Finally" + totalSkill,totalPersonality);
}
