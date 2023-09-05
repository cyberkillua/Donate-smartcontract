const { ethers } = require('hardhat');

const networkConfig = {
  11155111: {
    name: 'sepolia',
    minimumDonation: ethers.parseEther('0.01'),
  },
  31337: {
    name: 'hardhat',
    minimumDonation: ethers.parseEther('0.01'),
  },
};

const developmentChains = ['hardhat', 'localhost'];
module.exports = {
  developmentChains,
  networkConfig,
};
