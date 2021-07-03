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
   // setup.donor = await init.setupBank(setup.roles.donor1);
    return setup;
}

contract('Bank', async (accounts) => {
    let setup;
    let bank1 = {};
    let donor1 = {};
    context(">> deploy contract", async () => {
        before("!! Setup", async () => {
            setup = await deploy(accounts);
            bank1.address = setup.roles.admin;
            bank1.name = "Bank 1";
            bank1.city = "Pune";
            bank1.email = "admin@bank1.com";
            bank1.contact = "1234567891";
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
                const bankId = await setup.bank.bankId(setup.roles.admin);
                const response = await setup.bank.banks(bankId);
                expect(response.isBank.toString()).to.equal('1');
              
            });
           
            it("should emit event BankRegistered", async () => {
 
                await expectEvent.inTransaction(
                    
                    setup.data.tx.tx,
                    
                    setup.bank,
                    "BankRegistered"
                );
               // console.log(setup.bankId);
                
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
    context(">> Donor", async() => {
            before("!! Setup", async () => {
                setup = await deploy(accounts);
                const bankId = await setup.bank.bankId(setup.roles.admin);
                
                 donor1.Id = "1",
                 donor1.name = "ABC",
                 donor1.city = "Khopoli",
                 donor1.contact = "1234567809",
                 donor1.age = "30",
                 donor1.gender = "Female",
                 donor1.bloodgrp = "A-positive",
                 donor1.cname = "Bank1",
                 donor1.recentDonation = "60",
                {from: setup.roles.donor1}
            });  
            it("The donor is new donor", async () => {
                const donorId = await setup.bank.donorId(setup.roles.donor1);
                const response = await setup.bank.donors(donorId);
                expect(response.isDonor.toString()).to.equal('0');
                
            });
          
    });
    context(">> New Donor", async () => {
        context("$ regsitering donor for the first time", async () => {
            it("add a new donor", async () => {
                setup.data.tx = await setup.bank.RegisterDonor(
                    donor1.Id,
                    donor1.name,
                    donor1.city,
                    donor1.contact,
                    donor1.age,
                    donor1.gender,
                    donor1.bloodgrp,
                    donor1.cname,
                    donor1.recentDonation,
                   {from: setup.roles.donor1}
                );
                const donorId = await setup.bank.donorId(setup.roles.donor1);
                const response = await setup.bank.donors(donorId);
                expect(response.isDonor.toString()).to.equal('1');
              
            });
            it("should emit event DonorRegistered", async () => {
 
                await expectEvent.inTransaction(
                    
                    setup.data.tx,
                    
                    setup.bank,
                    "DonorRegistered"
                );
               // console.log(setup.bankId);
                
            });
            
        });
     

       
    });

});