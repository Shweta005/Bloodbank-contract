const Bank = artifacts.require('BloodBank');

module.exports = async (deployer) => {
     await deployer.deploy(Bank);
}