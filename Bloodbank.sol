pragma solidity 0.8.0;
 
 contract BloodBank{
     
     
        address public owner;
        
        enum BloodGroup{
              A_positive, //0
              A_negative, //1
              B_positive, //2
              B_negative,  //3
              AB_positive, //4
              AB_negative, //5
              O_positive,  //6
              O_negative   //7
              }

        struct  Bloodbank{
            address add;
            string  name;
            string  city;
            string  email;
            uint256 contact;
           // BloodGroup  bg;
           mapping(uint8 => uint256) bloodGroupQty;
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
              uint8 isDonor;
        }
       
        mapping(uint8 => uint256) public stock;
        mapping(address=> uint256) public bankId;
        mapping(uint256=> Bloodbank) public banks;
        //Bloodbank[] public bbanks;
        
        mapping(address=> uint256) public donorId;
        mapping(uint256=> Donor) public donors;
        //Donor[] public ddonors;
        
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
           modifier NotAdmin(address _add){
               uint256 id = bankId[_add];
               require(banks[id].isadmin == 0 ,"Bloodbank Account");
               _;
           }
      
        function NewBank(     //Add new Bloodbank
            address _add,
            string memory _name,
            string memory _city, 
            string memory _email,
            uint256 _contact
        
            ) onlyAdmin(msg.sender) public {
         
            counterB++;
            Bloodbank memory bank;
            bankId[_add] = counterB;
            bank.add = _add;
            bank.name = _name;
            bank.city = _city;
            bank.email = _email;
            bank.contact = _contact;
            bank.isBank = 1;
            bank.isadmin = 1;
            banks[counterB] = bank;
        }
        
        function RegisterDonor(      //Register Donor
              string memory _name,
              string memory _city,
              uint256 _contact,
              string memory _email,
              uint256 _age,
              string memory _gender,
              string memory _bloodgrp,
              uint8  _height,
              uint8  _weight,
              string memory _cname,
              uint256 _recentDonation
              )NotAdmin(msg.sender) public {
                  require(msg.sender != owner,"You are Owner");
                  counterD++;
                  Donor memory donor;
                  donorId[msg.sender] = counterD;
                  donor.add = msg.sender;
                  donor.name = _name;
                  donor.city = _city;
                  donor.contact = _contact;
                  donor.email = _email;
                  donor.age = _age;
                  donor.gender = _gender;
                  donor.bloodgrp = _bloodgrp;
                  donor.height = _height;
                  donor.weight = _weight;
                  donor.cname = _cname;
                  donor.recentDonation = (_recentDonation * 1 days);
                  donor.isDonor = 1;
                  donors[counterD] = donor;
              }
              
              
        function ViewBank(        //View Bloodbank's Data
            address _add
            ) public returns(
                address, 
                string memory, 
                string memory, 
                string memory,
                uint256,
                uint8,
                uint8){
            uint256 id = bankId[_add];
            return (
                banks[id].add,
                banks[id].name,
                banks[id].city,
                banks[id].email,
                banks[id].contact,
                banks[id].isBank,
                 banks[id].isadmin
                );
        }      
           
          function ViewDonor(address _add) public returns(  // View Donor's Data
                     address,
                     string memory,
                     string  memory,
                     uint256,
                     string  memory,
                     uint256,
                     string  memory,
                     string  memory,
                     uint8,  
                     uint8,  
                     string  memory,
                     uint256){
                     uint256 id = donorId[_add];
              return(
                     donors[id].add, 
                     donors[id].name, 
                     donors[id].city,  
                     donors[id].contact,
                     donors[id].email, 
                     donors[id].age, 
                     donors[id].gender, 
                     donors[id].bloodgrp,
                     donors[id].height, 
                     donors[id].weight, 
                     donors[id].cname,
                     donors[id].recentDonation
                  );
          } 
           
           //View Stock of Blood
            function viewStock() public view returns(uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256) {
            return (stock[0],
                    stock[1],
                    stock[2],
                    stock[3],
                    stock[4],
                    stock[5],
                    stock[6],
                    stock[7]); 
        }
              
        //update Blood Stock
        function updateStock(uint8 _bg,uint256 units) public {
            stock[_bg] = units;
            banks[bankId[msg.sender]].bloodGroupQty[_bg] += units;
        }
 }