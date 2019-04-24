pragma solidity ^0.4.24;

contract IUSDQToken {
    function totalSupply() public view returns (uint256);
    function balanceOf(address _owner) public view returns (uint256);
    function transfer(address _to, uint256 _value) public returns (bool);
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool);
    function mint(address _to, uint256 _amount) external returns (bool);
    function approveForOtherContracts(address _sender, address _spender, uint256 _value) external;
    function burnFrom(address _to, uint256 _amount) external returns (bool);
}