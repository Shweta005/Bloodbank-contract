const init = require("./helpers/setup.js");
const { Bank, BN, expectRevert, expectEvent, time, constants, Events: events } = init;

const deploy = async (accounts) => {
	const setup = init.init(accounts);
  //console.log(setup)
	setup.bank = await init.setupBank(setup.roles.deployer);
	//setup.bank is contract
	return setup;
};

contract("Bank", async (accounts) => {
	let setup;
	let bank1 = {};
	let donor1 = {};
	let requester = {};
	let owner = {};
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
	//////////////////////////////////////////////////deploy contract ended////////////////////////////
	context(">> NewBank", async () => {
		context("$ regsitering for the first time", async () => {
			it("# add a new bank", async () => {
				setup.data.tx = await setup.bank.NewBank(
					bank1.address,
					bank1.name,
					bank1.city,
					bank1.email,
					bank1.contact,
					{ from: setup.roles.deployer }
				);
			});
			it("# Bank is Exist ", async () => {
				//  setup.data.bankId = await setup.bank.bankId(setup.roles.admin)
				const bankId = await setup.bank.bankId(setup.roles.admin);
				const response = await setup.bank.banks(bankId);
				expect(response.isBank.toString()).to.equal("1");
			});
			it("# Admin exist", async () => {
				//  setup.data.bankId = await setup.bank.bankId(setup.roles.admin)
				const bankId = await setup.bank.bankId(setup.roles.admin);
				const response = await setup.bank.banks(bankId);
				expect(response.isadmin.toString()).to.equal("1");
			});
			it("# should emit event BankRegistered", async () => {
				await expectEvent.inTransaction(setup.data.tx.tx, setup.bank, "BankRegistered", {
					_cId: "1",
				});
				// console.log(setup.data.tx.logs[0].args);
				// console.log(setup.bankId);
			});
      it("# viewBank", async () => {
        const result = await setup.bank.ViewBank(setup.roles.admin);
        //console.log(result);
        expect( result['0']).to.equal(bank1.address);
        expect(result['1']).to.equal(bank1.name);
        expect( result['2']).to.equal(bank1.city);
        expect( result['3']).to.equal(bank1.email);
        expect( result['4'].toString()).to.equal(bank1.contact.toString());
        expect( result['5'].toString()).to.equal("1");
        expect( result['6'].toString()).to.equal("1");
      });	
      
		});
		context("$ registering again", async () => {
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.NewBank(bank1.address, bank1.name, bank1.city, bank1.email, bank1.contact, {
						from: setup.roles.deployer,
					}),
					"Bloodbank is already registered"
				);
			});
		});
		context("$ Deployer trying to register as a bank", async () => {
			before("!! Setup", async () => {
				bank1.address = setup.roles.deployer;
				bank1.name = "Bank";
				bank1.city = "Pune";
				bank1.email = "admin@bank1.com";
				bank1.contact = "1234561451";
			});
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.NewBank(bank1.address, bank1.name, bank1.city, bank1.email, bank1.contact, {
						from: setup.roles.deployer,
					}),
					"Owner:You cant be register as a bank."
				);
			});
		});
		context("$ Donor is registering a bank", async () => {
			before("!! Setup", async () => {
				bank1.address = setup.roles.deployer;
				bank1.name = "Bank1";
				bank1.city = "Pune";
				bank1.email = "admin@bank1.com";
				bank1.contact = "1224561451";
			});
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.NewBank(bank1.address, bank1.name, bank1.city, bank1.email, bank1.contact, {
						from: setup.roles.donor1,
					}),
					"You don't owner have access."
				);
			});
		});
	});
	///////////////////////////////////////////New bank ended//////////////////////////////////////////
	context(">> Donor", async () => {
		before("!! Setup", async () => {
			const bankId = await setup.bank.bankId(setup.roles.admin);

			(donor1.Id = 1),
				(donor1.name = "ABC"),
				(donor1.city = "Khopoli"),
				(donor1.contact = "1234567809"),
				(donor1.age = "30"),
				(donor1.gender = "Female"),
				(donor1.bloodgrp = "A-positive"),
				(donor1.cname = "Bank1"),
				(donor1.recentDonation = "60"),
				{ from: setup.roles.donor1 };
		});
		it("# The donor is new donor", async () => {
			const donorId = await setup.bank.donorId(setup.roles.donor1);
			const response = await setup.bank.donors(donorId);
			expect(response.isDonor.toString()).to.equal("0");
		});
	});
	///////////////////////Donor Ended//////////////////////////////////////////////////
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
					{ from: setup.roles.donor1 }
				);
        console.log(setup.data.tx.logs);
			});
			it("# should emit event DonorRegistered", async () => {
				await expectEvent.inTransaction(setup.data.tx.tx, setup.bank, "DonorRegistered");
				// console.log(setup.bankId);
			});
			it("# isDonor is equal to 1 after registration", async () => {
				const donorId = await setup.bank.donorId(setup.roles.donor1);
				const response = await setup.bank.donors(donorId);
				expect(response.isDonor.toString()).to.equal("1");
			});
      it("# viewDonor", async () => {
        const result = await setup.bank.ViewDonor(setup.roles.donor1);
        //console.log(result);
        //console.log(setup.roles.donor1);
      	expect( result['0']).to.equal(setup.roles.donor1);
        expect(result['1'].toString()).to.equal(donor1.Id.toString());
        expect( result['2']).to.equal(donor1.name);
        expect( result['3']).to.equal(donor1.city);
        expect( result['4'].toString()).to.equal(donor1.contact.toString());
        expect( result['5'].toString()).to.equal( donor1.age.toString());
        expect( result['6']).to.equal(donor1.gender);
        expect( result['7']).to.equal(donor1.bloodgrp);
        expect( result['8']).to.equal(donor1.cname);
        expect( result['9'].toString()).to.equal((donor1.recentDonation * 86400).toString());
        expect( result['10'].toString()).to.equal('0');
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
						{ from: setup.roles.donor1 }
					),
					"Already registered"
				);
			});
		});

		context("$ Donor registering in bank which is not exist", async () => {
			before("!! Setup", async () => {
				const bankId = await setup.bank.bankId(setup.roles.admin);

				(donor1.Id = 4),
					(donor1.name = "DEF"),
					(donor1.city = "Khopoli"),
					(donor1.contact = "1234567890"),
					(donor1.age = "30"),
					(donor1.gender = "Female"),
					(donor1.bloodgrp = "A-positive"),
					(donor1.cname = "Bank"),
					(donor1.recentDonation = "60"),
					{ from: setup.roles.donor2 };
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
						{ from: setup.roles.donor2 }
					),
					"Bloodbank does not exist"
				);
			});
		});
		context("$ False Validation : Contact", async () => {
			before("!! Setup", async () => {
				const bankId = await setup.bank.bankId(setup.roles.admin);
				(donor1.Id = 1),
					(donor1.name = "DEF"),
					(donor1.city = "Khopoli"),
					(donor1.contact = "12345"),
					(donor1.age = "30"),
					(donor1.gender = "Female"),
					(donor1.bloodgrp = "A-positive"),
					(donor1.cname = "Bank"),
					(donor1.recentDonation = "60"),
					{ from: setup.roles.donor2 };
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
						{ from: setup.roles.donor2 }
					),
					"Contact No should be 10 digits."
				);
			});
		});
		context("$ False Validation: Age", async () => {
			before("!! Setup", async () => {
				const bankId = await setup.bank.bankId(setup.roles.admin);
				(donor1.Id = 1),
					(donor1.name = "DEF"),
					(donor1.city = "Khopoli"),
					(donor1.contact = "1234567894"),
					(donor1.age = "3012"),
					(donor1.gender = "Female"),
					(donor1.bloodgrp = "A-positive"),
					(donor1.cname = "Bank"),
					(donor1.recentDonation = "60"),
					{ from: setup.roles.donor2 };
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
						{ from: setup.roles.donor2 }
					),
					"Age should be 2 digits."
				);
			});
		});
	});
	//////////////////////////////////////////////donor ended//////////////////////////////////////////
	context(">> Booking Slot", async () => {
		context("$ Booking slot for registered donor", async () => {
			before("!! Setup", async () => {
				donor1.Id = "1";
				donor1.time = "1625833122";
			});
			it("# Book slot", async () => {
				setup.data.tx = await setup.bank.BookSlot(donor1.Id, donor1.time, {
					from: setup.roles.admin,
				});
			});
			it("# should emit event Bookslot", async () => {
				await expectEvent.inTransaction(setup.data.tx.tx, setup.bank, "Bookslot", {
					_dId: "1",
				});
			});
		});
	});

	///////////////////////////booking slot ended//////////////////////////////////////////////////
	context("$ Reverting when recent donation days of regsitred donor is < 56days", async () => {
		before("!! Setup", async () => {
			const bankId = await setup.bank.bankId(setup.roles.admin);
			(donor1.Id = 1),
				(donor1.name = "DGH"),
				(donor1.city = "Khopoli"),
				(donor1.contact = "1234567894"),
				(donor1.age = "30"),
				(donor1.gender = "Male"),
				(donor1.bloodgrp = "A-positive"),
				(donor1.cname = "Bank1"),
				(donor1.recentDonation = "40"),
				{ from: setup.roles.donor2 };
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
				{ from: setup.roles.donor2 }
			);
		});
		context("$ Booking slot for registered donor2", async () => {
			before("!! Setup", async () => {
				donor1.Id = "2";
				donor1.time = "1625833122";
			});
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.BookSlot(donor1.Id, donor1.time, { from: setup.roles.admin }),
					"Wait for some days."
				);
			});
		});
	});
	////////////////////reverting donor 56 days/////////////////////////////////////

	context(">>Stock", async () => {
		context("$ Add stock", async () => {
			before("!! Setup", async () => {
				bank1.bloodgrp = "3";
				bank1.quantity = "20";
			});
			it("# update given qty to given bloodgrp", async () => {
				setup.data.tx = await setup.bank.IncreaseStock(bank1.bloodgrp, bank1.quantity, {
					from: setup.roles.admin,
				});
			});

			context("$ Reduce stock", async () => {
				before("!! Setup", async () => {
					bank1.bloodgrp = "3";
					bank1.quantity = "2";
				});
				it("# Reduce given qty to given bloodgrp", async () => {
					setup.data.tx = await setup.bank.ReduceStock(bank1.bloodgrp, bank1.quantity, {
						from: setup.roles.admin,
					});
				});
			});
		});
	});

	/////////////////////////stock ended//////////////////////////////
	context(">> Blood Request", async () => {
		context("$ Requester is requesting blood", async () => {
			before("!! Setup", async () => {
				(requester.CenterId = "1"), (requester.bloodgrp = "3");
				requester.quantity = "5";
			});
			it("# Requester's blood request to center1", async () => {
				setup.data.tx = await setup.bank.RequestBlood(
					requester.CenterId,
					requester.bloodgrp,
					requester.quantity,
					{ from: setup.roles.requester }
				);
			});
			it("# should emit event BloodRequest", async () => {
				await expectEvent.inTransaction(setup.data.tx.tx, setup.bank, "BloodRequest");
			});
		});
		context("$ Requester can be admin", async () => {
			before("!! Setup", async () => {
				(bank1.CenterId = "1"), (bank1.bloodgrp = "3");
				bank1.quantity = "5";
			});
			it("# Admin's blood request to center1", async () => {
				setup.data.tx = await setup.bank.RequestBlood(bank1.CenterId, bank1.bloodgrp, bank1.quantity, {
					from: setup.roles.admin,
				});
			});
		});
		context("$ Requester can be admin", async () => {
			before("!! Setup", async () => {
				(donor1.CenterId = "1"), (donor1.bloodgrp = "3");
				donor1.quantity = "5";
			});
			it("# Admin's blood request to center1", async () => {
				setup.data.tx = await setup.bank.RequestBlood(donor1.CenterId, donor1.bloodgrp, donor1.quantity, {
					from: setup.roles.donor1,
				});
			});
		});
		context("$ Requester can be Deployer", async () => {
			before("!! Setup", async () => {
				(owner.CenterId = "1"), (owner.bloodgrp = "3");
				owner.quantity = "5";
			});
			it("# Deployer's blood request to center1", async () => {
				setup.data.tx = await setup.bank.RequestBlood(owner.CenterId, owner.bloodgrp, owner.quantity, {
					from: setup.roles.deployer,
				});
			});
		});
		context("$ Requester- Deployer", async () => {
			before("!! Setup", async () => {
				(owner.CenterId = "1"), (owner.bloodgrp = "4");
				owner.quantity = "5";
			});
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.RequestBlood(owner.CenterId, owner.bloodgrp, owner.quantity, {
						from: setup.roles.deployer,
					}),
					"Stock is empty"
				);
			});
		});
	});
	context(">> Grant Request", async () => {
		context("$ Request can be granted by only admin", async () => {
			before("!! Setup", async () => {
				bank1.reqId = "1";
			});
			it("# Admin is granted 1st request", async () => {
				setup.data.tx = await setup.bank.GrantRequest(bank1.reqId, { from: setup.roles.admin });
			});
			it("# Reverts", async () => {
				await expectRevert(
					setup.bank.GrantRequest((bank1.reqId = "1"), { from: setup.roles.deployer }),
					"You don't have admin access."
				);
			});
			it("# should emit event RequestGranted", async () => {
				await expectEvent.inTransaction(setup.data.tx.tx, setup.bank, "RequestGranted");
			});
		});
	});
	context(">> Getters", async () => {
		it("# viewStock", async () => {
			const result = await setup.bank.viewStock(setup.roles.admin);
			expect(typeof result).to.equal(typeof []);
		});
	});
});
