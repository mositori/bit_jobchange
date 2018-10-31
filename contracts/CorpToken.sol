pragma solidity^0.4.24;
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

contract CorpToken is ERC721Full, ERC721Mintable{
    // structs
    struct CorpToken {
        uint16 eventId; // 0 = "Joining", 1 = "Retirement"
        uint16 skill;
        uint16 personallity;
        string date;
    }

    CorpToken[] private corpToken;

    // functions
    // defining the token's property its name and unit.
    constructor() public ERC721Full("CorpToken", "CORP")  {
        administrator = msg.sender;
    }

    // registering corporation's address to mapping "isCorp".

    // minting new token. this function can only be executed by registered corporations.
    function mint(uint16 _eventId, uint16 _skill, uint16 _personallity, string _date) public {
        uint256 id = corpToken.push(CorpToken(_eventId, _skill, _personallity, _date)) - 1;
        super._mint(msg.sender, id);
    }
}