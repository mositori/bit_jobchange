pragma solidity^0.4.24;
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "./openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

contract Token is ERC721Full, ERC721Mintable{
    struct UserToken {
        uint16 skill;
        uint16 personalitty;
        string mintedBy;
    }

    UserToken[] private userToken;

    constructor() public ERC721Full("UserToken", "UTKN")  {}

    function mint(uint16 _skill, uint16 _personalitty, string _mintedBy) public {
        uint256 id = userToken.push(UserToken(_skill, _personalitty, _mintedBy)) - 1;
        super._mint(msg.sender, id);
    }

    function getUserToken(uint256 _tokenId) public view returns (address, uint16, uint16, string, address) {
        return (ownerOf(_tokenId), userToken[_tokenId].skill, userToken[_tokenId].personalitty, userToken[_tokenId].mintedBy, getApproved(_tokenId));
    }
}