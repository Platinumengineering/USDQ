pragma solidity ^0.4.24;

import "./Multiownable.sol";

contract GovernanceMigratable is Multiownable {

  mapping(address => bool) public governanceContracts;

  event GovernanceContractAdded(address addr);
  event GovernanceContractRemoved(address addr);

  modifier onlyGovernanceContracts() {
    require(governanceContracts[msg.sender]);
    _;
  }


  function addAddressToGovernanceContract(address addr) onlyManyOwners public returns(bool success) {
    if (!governanceContracts[addr]) {
      governanceContracts[addr] = true;
      emit GovernanceContractAdded(addr);
      success = true;
    }
  }


  function removeAddressFromGovernanceContract(address addr) onlyManyOwners public returns(bool success) {
    if (governanceContracts[addr]) {
      governanceContracts[addr] = false;
      emit GovernanceContractRemoved(addr);
      success = true;
    }
  }
}