pragma solidity ^0.4.24;

import "./GovernanceMigratable.sol";

contract BlacklistMigratable is GovernanceMigratable {

    mapping(address => bool) public blacklist;

    event BlacklistedAddressAdded(address addr);
    event BlacklistedAddressRemoved(address addr);


    function addAddressToBlacklist(address addr) onlyGovernanceContracts() public returns(bool success) {
        if (!blacklist[addr]) {
            blacklist[addr] = true;
            emit BlacklistedAddressAdded(addr);
            success = true;
        }
    }


    function removeAddressFromBlacklist(address addr) onlyGovernanceContracts() public returns(bool success) {
        if (blacklist[addr]) {
            blacklist[addr] = false;
            emit BlacklistedAddressRemoved(addr);
            success = true;
        }
    }
}