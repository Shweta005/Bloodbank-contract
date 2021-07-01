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
              address cadd;
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
        uint256[8] public Showstock;
        
        constructor( ){
            owner = msg.sender;
           }
           
           modifier onlyAdmin(address _add) {
               uint256 id = bankId[_add];
               require(banks[id].isadmin == 1 || _add == owner , "You don't have access.");
               _;
           }
          
        function NewBank(     //Add new Bloodbank
            address _add,
            string memory _name,
            string memory _city, 
            string memory _email,
            uint256 _contact
        
            ) onlyAdmin(msg.sender) public {
            require(banks[bankId[msg.sender]].isBank == 0,"Bloodbank is already registered");
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
        
     function RegisterDonor(  //Register Donor
              address _cadd,                    
              string memory _name,
              string memory _city,
              uint256 _contact,
              uint256 _age,
              string memory _gender,
              string memory _bloodgrp,
              string memory _cname,
              uint256 _recentDonation
              ) public {
                  require(donors[donorId[msg.sender]].isDonor==0,"Already registered");
                  require(banks[bankId[_cadd]].isBank == 1, "Bloodbank not exist");
                  counterD++;
                  Donor memory donor;
                  donorId[msg.sender] = counterD;
                  donor.add = msg.sender;
                  donor.cadd = _cadd;
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
            ) onlyAdmin(msg.sender) public view returns(
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
           
        function ViewDonor(
                     address _add) 
                     public view returns(  // View Donor's Data
                     address,
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
                   
                     
            return( donors[id].add, 
                     donors[id].cadd,
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
          
          
          function GrantRequest(
              uint _id)
              public onlyAdmin(msg.sender) { //Admin will grant the blood request  if stock available
              uint8 grp = request[_id]._bloodgrp;
              require(banks[_id].stock[grp] != 0,"Stock is empty");
              request[_id].isGranted = 1;
          }
          
         function ReduceStock(address _add,uint8 _bloodgrp,uint256 _qty)onlyAdmin(msg.sender) public {
             banks[bankId[_add]].stock[_bloodgrp] -= _qty;
         }
          
         function IncreaseStock(address _add,uint8 _bloodgrp,uint256 _qty)onlyAdmin(msg.sender) public {
             banks[bankId[_add]].stock[_bloodgrp] += _qty;
         }
           
           
          //Stock availability
            function viewStock(address _add) public view returns(uint256[8] memory) {
                
                uint256[8] memory s;
                for(uint8 i; i<8 ; i++){
                   s[i] = banks[bankId[_add]].stock[i];
                }
            return s;
            }

 }       
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
           
         
        
        
        
        
       
        
        
       
             
            
           
           
        
        
        
        
 