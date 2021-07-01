
const Bank = artifacts.require('BloodBank');
const { expect } = require('chai');
const { BN, expectRevert, expectEvent, time, constants } = require('@openzeppelin/test-helpers');


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
    DAO,
    expect,
    BN,
    expectRevert,
    expectEvent,
    time,
    constants,
    Events
};