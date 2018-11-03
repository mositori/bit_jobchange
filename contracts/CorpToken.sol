pragma solidity^0.4.24;
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

contract CorpToken is ERC721Full, ERC721Mintable{
    // structs
    struct CorpToken {
        address from;
        uint16 eventId; // 0 = "Joining", 1 = "Retirement"
        uint16 skill;
        uint16 personallity;
        string date;
    }

    CorpToken[] private corpToken;

    // functions
    // defining the token's property its name and unit.
    constructor() public ERC721Full("CorpToken", "CORP")  {}

    // minting new token and transfering the token.
    function mintAndTransfer(address _to, uint16 _eventId, uint16 _skill, uint16 _personallity, string _date) public {
        uint256 id = corpToken.push(CorpToken(msg.sender, _eventId, _skill, _personallity, _date)) - 1;
        super._mint(msg.sender, id);
        transferFrom(msg.sender, _to, id);
    }
    
    // @return eventId, skill, personallity, date
    function getDetailOfToken(uint _tokenId) public view returns(address _from, uint16 _eventId, uint16 _skill, uint16 _personallity, string _date) {
        _from = corpToken[_tokenId].from;
        _eventId = corpToken[_tokenId].eventId;
        _skill = corpToken[_tokenId].skill;
        _personallity = corpToken[_tokenId].personallity;
        _date = corpToken[_tokenId].date;
    }
    
    //@return Array including tokenId _owner has.
    function getToken(address _owner) public view returns(uint[]){
        uint[] memory _temp = new uint[](balanceOf(_owner));
        for(uint i = 0; i < balanceOf(_owner); i++){
            _temp[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return _temp;
    }
}