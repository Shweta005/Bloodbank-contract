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
   //setup.bank is contract
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
        it("# the deployer is the owner", async () => {
            expect(await setup.bank.owner()).to.equal(setup.roles.deployer);
        });

    });
   
    context(">> NewBank", async () => {
        context("$ regsitering for the first time", async () => {
            it("# add a new bank", async () => {
                setup.data.tx = await setup.bank.NewBank(
                    bank1.address,
                    bank1.name,
                    bank1.city,
                    bank1.email,
                    bank1.contact,
                    {from: setup.roles.deployer}
                );
            });
            
            it("# Bank is Exist ", async () => {
              //  setup.data.bankId = await setup.bank.bankId(setup.roles.admin)
                const bankId = await setup.bank.bankId(setup.roles.admin);
                const response = await setup.bank.banks(bankId);
                expect(response.isBank.toString()).to.equal('1');
            });
            it("# Admin exist", async () => {
                //  setup.data.bankId = await setup.bank.bankId(setup.roles.admin)
                  const bankId = await setup.bank.bankId(setup.roles.admin);
                  const response = await setup.bank.banks(bankId);
                  expect(response.isadmin.toString()).to.equal('1');
              });
               
            it("# should emit event BankRegistered", async () => {
                await expectEvent.inTransaction(
                    setup.data.tx.tx,
                    setup.bank,
                    "BankRegistered",
                    {
                        _cId: "1"
                    }
                );
                // console.log(setup.data.tx.logs[0].args);
               // console.log(setup.bankId);
                
            });
        });
    


    context("$ registering again", async () => {
            it("# Reverts", async () => {
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
    context("$ Deployer trying to register as a bank", async() => {
            before("!! Setup", async () => {
                bank1.address = setup.roles.deployer;
                bank1.name = "Bank";
                bank1.city = "Pune";
                bank1.email = "admin@bank1.com";
                bank1.contact = "1234561451";
            });  
            it("# Reverts", async () => {
                await expectRevert(
                    setup.bank.NewBank(
                        bank1.address,
                        bank1.name,
                        bank1.city,
                        bank1.email,
                        bank1.contact,
                        {from: setup.roles.deployer}
                    ),
                    "Owner:You cant be register as a bank."
                );
            });  
    });
    context("$ Donor is registering a bank", async() => {
        before("!! Setup", async () => {
            bank1.address = setup.roles.deployer;
            bank1.name = "Bank1";
            bank1.city = "Pune";
            bank1.email = "admin@bank1.com";
            bank1.contact = "1224561451";
        });  
        it("# Reverts", async () => {
            await expectRevert(
                setup.bank.NewBank(
                    bank1.address,
                    bank1.name,
                    bank1.city,
                    bank1.email,
                    bank1.contact,
                    {from: setup.roles.donor1}
                ),
                "You don't admin have access."
            );
        });
       
      
});
        

});
    context(">> Donor", async() => {
            before("!! Setup", async () => {
                const bankId = await setup.bank.bankId(setup.roles.admin);
                
                 donor1.Id = 1,
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
            it("# The donor is new donor", async () => {
                const donorId = await setup.bank.donorId(setup.roles.donor1);
                const response = await setup.bank.donors(donorId);
                expect(response.isDonor.toString()).to.equal('0');
                
            });
          
    });
    context(">> New Donor", async () => {
        context("$ regsitering donor for the first time", async () => {
            it("# add a new donor", async () => {
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
            
            });
            it("# should emit event DonorRegistered", async () => {
                await expectEvent.inTransaction(
                    setup.data.tx.tx,
                    setup.bank,
                    "DonorRegistered"
                );
               // console.log(setup.bankId);
                
            });
            it("# isDonor is equal to 1 after registration", async () => { 
                const donorId = await setup.bank.donorId(setup.roles.donor1);
                const response = await setup.bank.donors(donorId);
                expect(response.isDonor.toString()).to.equal('1');
            });
        });
    context("$ donor registering again", async () => {
        it("# Reverts", async () => {
            await expectRevert(
                setup.bank.RegisterDonor(
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
                ),
                "Already registered"
            );
        });
    });

    context("$ Donor registering in bank which is not exist", async() => {
        before("!! Setup", async () => {
            const bankId = await setup.bank.bankId(setup.roles.admin);
                
            donor1.Id = 4,
            donor1.name = "DEF",
            donor1.city = "Khopoli",
            donor1.contact = "1234567890",
            donor1.age = "30",
            donor1.gender = "Female",
            donor1.bloodgrp = "A-positive",
            donor1.cname = "Bank",
            donor1.recentDonation = "60",
           {from: setup.roles.donor2}
        });  
        it("# Reverts", async () => {
            await expectRevert(
                setup.bank.RegisterDonor(
                    donor1.Id,
                    donor1.name,
                    donor1.city,
                    donor1.contact,
                    donor1.age,
                    donor1.gender,
                    donor1.bloodgrp,
                    donor1.cname,
                    donor1.recentDonation,
                   {from: setup.roles.donor2}
                ),
                "Bloodbank does not exist"
            );
        });
        
      
});
  context("$ False Validation : Contact", async() => {
    before("!! Setup", async () => {
        const bankId = await setup.bank.bankId(setup.roles.admin);     
        donor1.Id = 1,
        donor1.name = "DEF",
        donor1.city = "Khopoli",
        donor1.contact = "12345",
        donor1.age = "30",
        donor1.gender = "Female",
        donor1.bloodgrp = "A-positive",
        donor1.cname = "Bank",
        donor1.recentDonation = "60",
       {from: setup.roles.donor2}
    });  
    it("# Reverts", async () => {
        await expectRevert(
            setup.bank.RegisterDonor(
                donor1.Id,
                donor1.name,
                donor1.city,
                donor1.contact,
                donor1.age,
                donor1.gender,
                donor1.bloodgrp,
                donor1.cname,
                donor1.recentDonation,
               {from: setup.roles.donor2}
            ),
            "Contact No should be 10 digits."
        );
    }); 
});
context("$ False Validation: Age", async() => {
    before("!! Setup", async () => {
        const bankId = await setup.bank.bankId(setup.roles.admin);
        donor1.Id = 1,
        donor1.name = "DEF",
        donor1.city = "Khopoli",
        donor1.contact = "1234567894",
        donor1.age = "3012",
        donor1.gender = "Female",
        donor1.bloodgrp = "A-positive",
        donor1.cname = "Bank",
        donor1.recentDonation = "60",
       {from: setup.roles.donor2}
    });  
    it("# Reverts", async () => {
        await expectRevert(
            setup.bank.RegisterDonor(
                donor1.Id,
                donor1.name,
                donor1.city,
                donor1.contact,
                donor1.age,
                donor1.gender,
                donor1.bloodgrp,
                donor1.cname,
                donor1.recentDonation,
               {from: setup.roles.donor2}
            ),
            "Age should be 2 digits."
        );
    }); 
  });     
});
     context(">>Stock",async()=>{
        context("$ Add stock", async()=>{
            before("!! Setup", async () => {
                bank1.bloodgrp = "3";
                bank1.quantity = "10";  
            });
            it("# update given qty to given bloodgrp", async ()=> {
                setup.data.tx = await setup.bank.IncreaseStock(
                    bank1.bloodgrp,
                    bank1.quantity,
                    {from: setup.roles.admin}
                );
                
             });
             it("# Reduce given qty to given bloodgrp", async ()=> {
                setup.data.tx = await setup.bank.ReduceStock(
                    bank1.bloodgrp,
                    bank1.quantity,
                    {from: setup.roles.admin}
                );
                
             });
         

     });
    });






   context(">> Booking Slot", async() =>{
         context("$ Booking slot for registered donor", async()=>{
            before("!! Setup", async () => {
                donor1.Id = "1";
                donor1.time = "1625833122";  
            });
            it("# Book slot", async ()=> {
                setup.data.tx = await setup.bank.BookSlot(
                    donor1.Id,
                    donor1.time,
                    {from: setup.roles.admin}
                );
             });
             it("# should emit event Bookslot", async () => {
                await expectEvent.inTransaction(
                    setup.data.tx.tx,
                    setup.bank,
                    "Bookslot",
                    {
                        _dId: "1"
                    }
                );    
            });
         });

     });
     context("$ Reverting when recent donation days of regsitred donor is < 56days", async() => {
        before("!! Setup", async () => {
            const bankId = await setup.bank.bankId(setup.roles.admin);
            donor1.Id = 1,
            donor1.name = "DGH",
            donor1.city = "Khopoli",
            donor1.contact = "1234567894",
            donor1.age = "30",
            donor1.gender = "Male",
            donor1.bloodgrp = "A-positive",
            donor1.cname = "Bank1",
            donor1.recentDonation = "40",
           {from: setup.roles.donor2}
        });  
       // Register that donor & write revert down that the
       it("# add a second donor", async () => {
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
           {from: setup.roles.donor2}
        );
    
    });
      context("$ Booking slot for registered donor2", async()=>{
        before("!! Setup", async () => {
            donor1.Id = "2";
            donor1.time = "1625833122";  
        });
        it("# Reverts", async () => {
            await expectRevert(
                setup.bank.BookSlot(
                donor1.Id,
                donor1.time,
                {from: setup.roles.admin}
                ),
                "Wait for some days."
            );
        });
        
     });    
    });


});