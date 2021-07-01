const {
    Bank,
    BN,
    expectRevert, 
    expectEvent, 
    time, 
    constants,
    Events: events
} = require('./helpers/setup.js');

contract('Bank', async (accounts) => {
    let [owner, admin1, donor1, donor2] = accounts;

    context('# Deploy BloodBank', async () => {
        before("!! Deploy bank for testing", async () => {
            bank = await bank.new({from: deployer});
        })
    });

    
   


});