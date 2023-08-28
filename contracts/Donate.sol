// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

error Donate__NotEnoughETHDonated();

contract Donate {
    /* STATE VARIABLES */
    uint256 private constant MINIMUM_DONATION = 0;
    uint256 private immutable i_amountDonated;
    address payable[] private s_donors;

    constructor(uint256 amountDonated) {
        i_amountDonated = amountDonated;
    }

    function donate() public payable {
        if (msg.value < MINIMUM_DONATION) {
            revert Donate__NotEnoughETHDonated();
        }
        s_donors.push(payable(msg.sender));
    }

    function withdraw() public payable {
        // sends all entire balance to the caller

        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed");
    }

    /* GETTERS */
    function getMinimumDonation() public pure returns (uint256) {
        return MINIMUM_DONATION;
    }

    function getAmountDonated() public view returns (uint256) {
        return i_amountDonated;
    }

    function getDonor(uint256 index) public view returns (address) {
        return s_donors[index];
    }
}
