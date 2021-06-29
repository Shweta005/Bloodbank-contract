pragma solidity 0.8.0;
 
 contract BloodBank{
     
     
        address public owner;
        
        struct Bloodstock{
            uint256  A_positive;
            uint256  A_negative;
            uint256  B_positive;
            uint256  B_negative;
            uint256  AB_positive;
            uint256  AB_negative;
            uint256  O_positive;
            uint256  O_negative;
              }
              
        struct  Bloodbank{
            address add;
            string  name;
            string  city;
            string  email;
            uint256 contact;
            Bloodstock stock;
            uint8 isBank;
            uint8 isadmin;
        }
        struct Donor{
              address add;
              string name;
              string city;
              uint256 contact;
              string email;
              uint256 age;
              string  gender;
              string bloodgrp;
              uint8  height;
              uint8  weight;
              string cname;
              uint256 recentDonation;
        }
        
        
        mapping(address=> uint256) public bankId;
        mapping(uint256=> Bloodbank) public banks;
        //Bloodbank[] public bbanks;
         
        mapping(address=> uint256) public donorId;
        mapping(uint256=> Donor) public donors;
        Donor[] public ddonors;
        
        uint256 public counterB;
        uint256 public counterD;
        
        
        constructor(
            string memory _name,
            string memory _city, 
            string memory _email, 
            uint256 _contact
            ){
            owner = msg.sender;
            counterB++;
            Bloodbank memory bank;
            bankId[owner] = counterB;
            bank.add = owner;
            bank.name = _name;
            bank.city = _city;
            bank.email = _email;
            bank.contact = _contact;
            bank.isBank = 1;
            bank.isadmin = 1;
            banks[counterB] = bank;
            
           }
           
           modifier onlyAdmin(address _add) {
               uint256 id = bankId[_add];
               require(banks[id].isadmin == 1 , "You don't have access.");
               _;
           }
      
        function NewBank(
            address add,
            string memory _name,
            string memory _city, 
            string memory _email,
            uint256 _contact
            ) onlyAdmin(msg.sender) public {
         
            counterB++;
            Bloodbank memory bank;
            bankId[add] = counterB;
            bank.add = add;
            bank.name = _name;
            bank.city = _city;
            bank.email = _email;
            bank.contact = _contact;
            bank.isBank = 1;
            bank.isadmin = 1;
            banks[counterB] = bank;
        }
        
        function RegisterDonor(
              string memory name,
              string memory city,
              uint256 contact,
              string memory email,
              uint256 age,
              string memory gender,
              string memory bloodgrp,
              uint8  height,
              uint8  weight,
              string memory cname,
              uint256 recentDonation) public {
                  counterD++;
                  Donor memory donor;
                  donorId[msg.sender] = counterD;
                  donor.add = msg.sender;
                  donor.name = name;
                  donor.city = city;
                  donor.contact = contact;
                  donor.email = email;
                  donor.age = age;
                  donor.gender = gender;
                  donor.bloodgrp = bloodgrp;
                  donor.height = height;
                  donor.weight = weight;
                  donor.cname = cname;
                  donor.recentDonation = recentDonation;
                  donors[counterD] = donor;
                  
              }
        
        
        
        
        
        
        
        
        
        function Update(address add ,string memory grp,uint256 units) public {
           
            uint256 id = bankId[add];
            
            if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Apositive")))){
             banks[id].stock.A_positive = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Anegative")))){
                banks[id].stock.A_negative = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Bpositive")))){
                 banks[id].stock.B_positive = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Bnegative")))){
                banks[id].stock.B_negative = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Opositive")))){
             banks[id].stock.O_positive = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("Onegative")))){
                banks[id].stock.O_negative = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("ABpositive")))){
                banks[id].stock.AB_positive = units;
            }
            else if(keccak256(abi.encodePacked((grp))) == keccak256(abi.encodePacked(("ABnegative")))){
               banks[id].stock.AB_negative = units;
            }
            
          
        }
             
            
           
           
        
        
        
        
 }