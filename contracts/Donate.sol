// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

error Donate__NotEnoughETHDonated();
error Donate__NotOwner();

contract Donate {
    /* DONATION VARIABLES */
    uint256 private immutable i_minimumDonation;
    address payable[] private s_donors;
    address immutable i_owner;
    uint256 private s_totalAmountDonated;

    modifier onlyOwner() {
        if (msg.sender != i_owner) revert Donate__NotOwner();
        _;
    }

    constructor(uint256 minimumDonation) {
        i_owner = msg.sender;
        i_minimumDonation = minimumDonation;
    }

    function donate() public payable {
        if (msg.value < i_minimumDonation) {
            revert Donate__NotEnoughETHDonated();
        }
        s_donors.push(payable(msg.sender));
        s_totalAmountDonated = address(this).balance;
    }

    function withdraw() public onlyOwner {
        // sends all entire balance to the caller

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    /* GETTERS */
    function getMinimumDonation() public view returns (uint256) {
        return i_minimumDonation;
    }

    function getDonor(uint256 index) public view returns (address) {
        return s_donors[index];
    }

    function getTotalDonation() public view returns (uint256) {
        return s_totalAmountDonated;
    }
}
