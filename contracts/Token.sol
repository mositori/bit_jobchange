pragma solidity^0.4.24;
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

contract Token is ERC721Full, ERC721Mintable{
    struct UserToken {
        uint16 skill;
        uint16 personality;
    }

    UserToken[] private userToken;

    constructor() public ERC721Full("UserToken", "USER")  {}

    function mintAndTransfer_USER(address _to, uint16 _skill, uint16 _personality) public {
        uint256 id = userToken.push(UserToken(_skill, _personality)) - 1;
        super._mint(msg.sender, id);
        transferFrom(msg.sender, _to, id);
    }

    function getDetailOfToken_USER(uint256 _tokenId) public view returns (uint16 _skill, uint16 _personality) {
        _skill = userToken[_tokenId].skill;
        _personality = userToken[_tokenId].personality;
    }

    function getToken_USER(address _owner) public view returns(uint[]){
        uint[] memory _temp = new uint[](balanceOf(_owner));
        for(uint i = 0; i < balanceOf(_owner); i++){
            _temp[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return _temp;
    }
}