const Bank = artifacts.require('BloodBank');
const { expect } = require('chai');
const { BN, expectRevert, expectEvent, time, constants } = require('@openzeppelin/test-helpers');

const init = (accounts) => {
    const setup = {};

    setup.roles = {
        deployer: accounts[0],
        admin: accounts[1],
        donor1: accounts[2],
        donor2: accounts[3],
        requester: accounts[4],
        dump: accounts.slice(5)
    }

    setup.data = {};

    return setup;

}

const setupBank = async (deployer) => await Bank.new({from: deployer});


const Events = [
        'Bookslot',
        'DonorRegistered',
        'BankRegistered',
        'BloodRequest',
        'RequestGranted',
        'StockIncreased',
        'StockDecreased'
];

module.exports = {
    init,
    setupBank,
    Bank,
    expect,
    BN,
    expectRevert,
    expectEvent,
    time,
    constants,
    Events
};