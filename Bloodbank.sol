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

        
         struct Requests{
             address _requester;
             address _to;
             uint8 _bloodgrp;
             uint256 _qty;
             uint isGranted;
         }     
      
    
        struct  Bloodbank{
            address add;
            string  name;
            string  city;
            string  email;
            uint256 contact;
            uint8 isBank;
            uint8 isadmin;
            mapping(uint8 => uint256)  stock;
        }

        
      struct Donor{

              address add;
              string name;
              string city;
              uint256 contact;
              uint256 age;
              string  gender;
              string bloodgrp;
              string cname;
              uint256 recentDonation;
              uint8 isDonor;
      }
       
  
        mapping(address=> uint256) public bankId;
        mapping(uint256=> Bloodbank) public banks;
        
        
        mapping(address=> uint256) public donorId;
        mapping(uint256=> Donor) public donors;
        
        mapping(uint256 =>Requests) public request;
       
        uint256 public counterB;
        uint256 public counterD;
        uint256 public counterCD;
        uint256 public counterR;
        
        constructor( ){
            owner = msg.sender;
               }

           modifier onlyAdmin(address _add) {
               uint256 id = bankId[_add];
               require(banks[id].isadmin == 1 || _add == owner , "You don't have access.");
               _;
           }
           
          
           modifier NotAdmin(address _add){
               uint256 id = bankId[_add];
               require(banks[id].isadmin == 0,"Bloodbank Account");
               _;
           }

        function NewBank(     //Add new Bloodbank
            address _add,
            string memory _name,
            string memory _city,
            string memory _email,
            uint256 _contact
           ) public onlyAdmin(msg.sender) {
            counterB++;
            Bloodbank storage bank = banks[counterB];
            bankId[_add] = counterB;
            bank.add = _add;
            bank.name = _name;
            bank.city = _city;
            bank.email = _email;
            bank.contact = _contact;
            bank.isBank = 1;
            bank.isadmin = 1;
            
        }
     function RegisterDonor(      //Register Donor
              string memory _name,
              string memory _city,
              uint256 _contact,
              uint256 _age,
              string memory _gender,
              string memory _bloodgrp,
              string memory _cname,
              uint256 _recentDonation

              )NotAdmin(msg.sender) public {
                  counterD++;
                  Donor memory donor;
                  donorId[msg.sender] = counterD;
                  donor.add = msg.sender;
                  donor.name = _name;
                  donor.city = _city;
                  donor.contact = _contact;
                  donor.age = _age;
                  donor.gender = _gender;
                  donor.bloodgrp = _bloodgrp;
                  donor.cname = _cname;
                  donor.recentDonation = (_recentDonation * 1 days);
                  donor.isDonor = 1;
                  donors[counterD] = donor;

              } 
              
              
        function ViewBank(        //View Bloodbank's Data
            address _add
            ) public view returns(
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
           
        function ViewDonor(address _add) public view returns(  // View Donor's Data
                     address,
                     string memory,
                     string  memory,
                     uint256,
                     uint256,
                     string  memory,
                     string  memory,
                     string  memory,
                     uint256){
                     uint256 id = donorId[_add];
              return(
                     donors[id].add,
                     donors[id].name,
                     donors[id].city,
                     donors[id].contact,
                     donors[id].age, 
                     donors[id].gender, 
                     donors[id].bloodgrp,
                     donors[id].cname,
                     donors[id].recentDonation
                  );
          } 
          
          function RequestBlood(address _add,uint8 _bloodgrp,uint256 _units) public { //Request for blood to particular center
              counterR++;
              Requests memory req = Requests(msg.sender,_add,_bloodgrp,_units,0);
              request[counterR] = req;
          }
          
          
          function GrantRequest(uint _id)public onlyAdmin(msg.sender) { //Admin will grant the blood request  if stock available
             // check stock exist
             request[_id].isGranted = 1;
            
          }
          
          
          
          //After blood donation of donor at bloodbank,Admin will Update Stock
          function ConfirmDonation(address _add,uint8 _type,uint256 _units) onlyAdmin(msg.sender) public   { 
            require(donors[donorId[_add]].isDonor == 1,"Donor does not exist");
            counterCD++;
            banks[bankId[msg.sender]].stock[_type] += _units;
             
           }
           
           
           /*//have issue with array length
            function viewStock(address _add) public view returns(uint256[] memory) {
                uint n = 8;
                uint256[n] memory s;
                
                for(uint8 i; i<n ; i++){
                   s[i] = banks[bankId[_add]].stock[i];
                }
            return s;
            }*/

 }       

