pragma solidity 0.8.0;
 
 contract BloodBank {
    address public owner;

    enum BloodGroup {
        A_positive, //0
        A_negative, //1
        B_positive, //2
        B_negative, //3
        AB_positive, //4
        AB_negative, //5
        O_positive, //6
        O_negative //7
    }

    struct Requests {
        address _requester;
        uint256 _cId;
        uint8 _bloodgrp;
        uint256 _qty;
        uint256 isGranted;
    }

    struct Bloodbank {
        address add;
        string name;
        string city;
        string email;
        uint256 contact;
        uint8 isBank;
        uint8 isadmin;
        mapping(uint8 => uint256) stock;
    }

    struct Donor {
        address add;
        uint256 cId;
        string name;
        string city;
        uint256 contact;
        uint256 age;
        string gender;
        string bloodgrp;
        string cname;
        uint256 recentDonation;
        uint8 isDonor;
        uint256 _slot;
    }

    //Mappings
    mapping(address => uint256) public bankId;
    mapping(uint256 => Bloodbank) public banks;
    mapping(address => uint256) public donorId;
    mapping(uint256 => Donor) public donors;
    mapping(uint256 => Requests) public request;
    mapping(uint256 => uint256[]) public slot;

    //events
    event Bookslot(uint256 _dId, uint256 _time, uint256 _slottime);
    event DonorRegistered(
        address _donor,
        uint256 _center,
        string _bloodgrp,
        uint256 _recentDonation
    );
    event BankRegistered(address _bank, string _centerName);
    event BloodRequest(
        address _requester,
        uint256 _cId,
        uint8 _bloodgrp,
        uint256 _units,
        uint256 _time
    );
    event RequestGranted(address _admin, uint256 _requesterid, uint256 _time);
    event StockIncreased(
        address _center,
        uint8 _bloodgrp,
        uint256 _qty,
        uint256 _time
    );
    event StockDecreased(
        address _center,
        uint8 _bloodgrp,
        uint256 _qty,
        uint256 _time
    );

    //counters & arrays
    uint256 public counterB;
    uint256 public counterD;
    uint256 public counterR;
    uint256[8] Showstock;
    uint256[] timestamp;

    constructor() {
        owner = msg.sender;
    }

    //admin check
    modifier onlyAdmin(address _add) {
        uint256 id = bankId[_add];
        require(
            banks[id].isadmin == 1 || _add == owner,
            "You don't have access."
        );
        _;
    }
    
     modifier validContact(uint _contact)  {
    uint8 digits = 0;
    while (_contact != 0) {
        _contact /= 10;
        digits++;
    }
    require(digits==10 ,"Contact No should be 10 digits.");
    _;
   }
    modifier validAge(uint _age)  {
    uint8 digits = 0;
    while (_age != 0) {
        _age /= 10;
        digits++;
    }
    require(digits==2 ,"Age is should be 2 digits.");
    _;
   }

    //Add new Bloodbank
    function NewBank(
        address _add,
        string memory _name,
        string memory _city,
        string memory _email,
        uint256 _contact
    ) public onlyAdmin(msg.sender) validContact(_contact)  {
        require(_add != owner, "Owner:You cant be register as a bank.");
        require(
            banks[bankId[_add]].isBank == 0,
            "Bloodbank is already registered"
        );
        
        counterB++;
        bankId[msg.sender] = counterB;
        Bloodbank storage bank = banks[counterB];
        bankId[_add] = counterB;
        bank.add = _add;
        bank.name = _name;
        bank.city = _city;
        bank.email = _email;
        bank.contact = _contact;
        bank.isBank = 1;
        bank.isadmin = 1;
        emit BankRegistered(_add, _name);
    }

    //View Bloodbank's Data
    function ViewBank(address _add)
        public
        view
        onlyAdmin(msg.sender)
        returns (
            address,
            string memory,
            string memory,
            string memory,
            uint256,
            uint8,
            uint8
        )
    {
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

    //After registration of donor, admin will book slot for donor if recentDonation condition fulfills
    function BookSlot(uint256 _dId, uint256 _slottime)
        public
        onlyAdmin(msg.sender)
    {
        //check the recentDonation of donor is 56 days, if valid then only send slot
        require(
            donors[_dId].recentDonation >= (56 * 1 days),
            "Wait for some days."
        );
        donors[_dId]._slot = _slottime;
        slot[_dId].push(_slottime);
        emit Bookslot(_dId, block.timestamp, _slottime);
    }

    //If stock is available admin will grant request
    function GrantRequest(uint256 _id) public onlyAdmin(msg.sender) {
        //Admin will grant the blood request  if stock available
        uint8 grp = request[_id]._bloodgrp;
        require(banks[_id].stock[grp] != 0, "Stock is empty");
        request[_id].isGranted = 1;
        emit RequestGranted(msg.sender, _id, block.timestamp);
    }

    //Quantity minus
    function ReduceStock(
        uint8 _bloodgrp,
        uint256 _qty
    ) public onlyAdmin(msg.sender) {
        banks[bankId[msg.sender]].stock[_bloodgrp] -= _qty;
        emit StockDecreased(msg.sender, _bloodgrp, _qty, block.timestamp);
    }

    //Quantity plus
    function IncreaseStock(
        uint8 _bloodgrp,
        uint256 _qty
    ) public onlyAdmin(msg.sender) {
        banks[bankId[msg.sender]].stock[_bloodgrp] += _qty;
        emit StockIncreased(msg.sender, _bloodgrp, _qty, block.timestamp);
    }

    //Register Donor
    function RegisterDonor(
        uint256 _cId,
        string memory _name,
        string memory _city,
        uint256 _contact,
        uint256 _age,
        string memory _gender,
        string memory _bloodgrp,
        string memory _cname,
        uint256 _recentDonation
    ) public validContact(_contact) validAge(_age)  {
        require(donors[donorId[msg.sender]].isDonor == 0, "Already registered");
        require(banks[_cId].isBank == 1, "Bloodbank not exist");
        counterD++;
        Donor memory donor;
        donorId[msg.sender] = counterD;
        donor.add = msg.sender;
        donor.cId = _cId;
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
        emit DonorRegistered(msg.sender, _cId, _bloodgrp, _recentDonation);
    }

    // View Donor's Data
    function ViewDonor(address _add)
        public
        view
        returns (
            address,
            uint256,
            string memory,
            string memory,
            uint256,
            uint256,
            string memory,
            string memory,
            string memory,
            uint256,
            uint256
        )
    {
        uint256 id = donorId[_add];
        return (
            donors[id].add,
            donors[id].cId,
            donors[id].name,
            donors[id].city,
            donors[id].contact,
            donors[id].age,
            donors[id].gender,
            donors[id].bloodgrp,
            donors[id].cname,
            donors[id].recentDonation,
            donors[id]._slot
        );
    }

    //Request for blood to particular center
    function RequestBlood(
        uint256 _cId,
        uint8 _bloodgrp,
        uint256 _units
    ) public {
        counterR++;
        Requests memory req = Requests(msg.sender, _cId, _bloodgrp, _units, 0);
        request[counterR] = req;
        emit BloodRequest(msg.sender, _cId, _bloodgrp, _units, block.timestamp);
    }

    //Stock availability
    function viewStock(address _add) public view returns (uint256[8] memory) {
        uint256[8] memory s;
        for (uint8 i; i < 8; i++) {
            s[i] = banks[bankId[_add]].stock[i];
        }
        return s;
    }
   
}
