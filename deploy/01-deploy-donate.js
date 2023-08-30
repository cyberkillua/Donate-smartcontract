const { network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat.config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId;

  const minimumDonation = networkConfig[chainId]["minimumDonation"];

  console.log("Going to deploy  contract");
  console.log(deployer);
  console.log(minimumDonation);

  const args = [minimumDonation];

  const donate = await deploy("Donate", {
    from: deployer,
    args: args,
    log: true,
    waitConfrimations: network.config.blockConfirmations || 1,
  });

  if (!developmentChains.includes(network.name) && process.env.ETHER_API_KEY) {
    await verify(donate.address, args);
  }

  log("----------------------------------");
};

module.exports.tags = ["all", "donate"];
