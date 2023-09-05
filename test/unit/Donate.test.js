/* eslint-disable no-undef */

const { assert, expect } = require("chai");
const { deployments, ethers, network } = require("hardhat");

const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat.config");

const chainId = network.config.chainId;

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Donate", async function () {
      let deployer, donate, accounts;

      beforeEach(async function () {
        accounts = await ethers.getSigners();
        deployer = accounts[0];
        await deployments.fixture(["all"]);
        const DonateContract = await deployments.get("Donate");
        donate = await ethers.getContractAt("Donate", DonateContract.address);
      });

      describe("constructor", async function () {
        it("sets the minimum donation correctly", async function () {
          const response = await donate.getMinimumDonation();
          console.log(networkConfig[chainId]["minimumDonation"]);
          assert.equal(response, networkConfig[chainId]["minimumDonation"]);
        });
      });

      describe("donate", async function () {
        it("reverts when amount sent is not up to minimum donation", async function () {
          await expect(donate.donate()).to.be.rejectedWith(
            "Donate__NotEnoughETHDonated"
          );
        });

        it("records donnors when dey donate", async function () {
          const amountDonated = ethers.parseEther("0.01");
          await donate.donate({ value: amountDonated });
          const donor = await donate.getDonor(0);
          assert.equal(donor, deployer.address);
        });
      });

      describe("withdraw", async function () {
        it("can only be withdrawn but owner of contract", async function () {
          const donateConnectedContract = await donate.connect(accounts[1]);
          await expect(donateConnectedContract.withdraw()).to.be.rejectedWith(
            "Donate__NotOwner"
          );
        });
      });
    });
