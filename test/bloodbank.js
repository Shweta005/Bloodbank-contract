const init = require('./helpers/setup.js');
const {
    Bank,
    BN,
    expectRevert, 
    expectEvent, 
    time, 
    constants,
    Events: events
} = init;

const deploy = async (accounts) => {
    const setup = init.init(accounts);

    setup.bank = await init.setupBank(setup.roles.deployer);

    return setup;
}

contract('Bank', async (accounts) => {
    let setup;
    let bank1 = {};
    context(">> deploy contract", async () => {
        before("!! Setup", async () => {
            setup = await deploy(accounts);
            bank1.address = setup.roles.admin;
            bank1.name = "Bank 1";
            bank1.city = "Pune";
            bank1.email = "admin@bank1.com";
            bank1.contact = "0000000000";
        });
        it("the deployer is the admin", async () => {
            expect(await setup.bank.owner()).to.equal(setup.roles.deployer);
        });
    });
    context(">> NewBank", async () => {
        context("$ regsitering for the first time", async () => {
            it("add a new bank", async () => {
                setup.data.tx = await setup.bank.NewBank(
                    bank1.address,
                    bank1.name,
                    bank1.city,
                    bank1.email,
                    bank1.contact,
                    {from: setup.roles.deployer}
                );
                const bankId = await setup.bank.bankId(setup.roles.deployer);
                const response = await setup.bank.banks(bankId);
                expect(response.isBank.toString()).to.equal('1');
            });
            it("should emit event BankRegistered", async () => {
                await expectEvent.inTransaction(
                    setup.data.tx.tx,
                    setup.bank,
                    "BankRegistered"
                );
            });
        })
        context("$ registering again", async () => {
            it("reverts", async () => {
                await expectRevert(
                    setup.bank.NewBank(
                        bank1.address,
                        bank1.name,
                        bank1.city,
                        bank1.email,
                        bank1.contact,
                        {from: setup.roles.deployer}
                    ),
                    "Bloodbank is already registered"
                );
            });
        });
    });

});