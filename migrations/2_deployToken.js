var CorpToken = artifacts.require("./CorpToken.sol");
var Token = artifacts.require("./Token.sol");

module.exports = function(deployer) {
  deployer.deploy(CorpToken);
  deployer.deploy(Token);
};
