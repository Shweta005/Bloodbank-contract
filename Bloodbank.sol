pragma solidity 0.8.0;
 
 contract BloodBank{
      
      enum Gender {Male, Female, Other}
      address public admin;
        struct Bloodstock{
            uint256 A_positive;
            uint256 A_negative;
            uint256 B_positive;
            uint256 B_negative;
            uint256 AB_positive;
            uint256 AB_negative;
            uint256 O_positive;
            uint256 O_negative;
              }
              
        struct  Bloodbank{
            string  name;
            string  city;
            string  email;
            uint256 contact;
            Bloodstock stock;
        }
        struct Donor{
              string name;
              string city;
              uint256 contact;
              string email;
              uint256 DOB;
              Gender  gender;
              string bloodgrp;
              uint8  height;
              uint8  Weight;
              string cname;
              uint256 bdonated;
        }
        
        
        mapping(address=> uint256) public bankId;
        mapping(uint256=> Bloodbank) public banks;
        Bloodbank[] public bbanks;
         
        mapping(address=> uint256) public donorId;
        mapping(uint256=> Donor) public donors;
        Donor[] public ddonors;
        
        uint256 public counterB;
        uint256 public counterD;
        
        
        constructor(){
            admin = msg.sender;
           }
           
        function RegisterBloodbank(string memory _name,string memory _city, string memory _email, uint256 _contact) public {
            counterB++;
            Bloodbank memory bank;
            bankId[msg.sender] = counterB;
            bank.name = _name;
            bank.city = _city;
            bank.email = _email;
            bank.contact = _contact;
            banks[counterB] = bank;
            bbanks.push(bank);
        }
        
        function updatestockByindex(uint256 index,struct _bloodtype,uint256 _no) public {
            stock.
            //bbanks[index].stock.A_positive = _no;
        }
 }