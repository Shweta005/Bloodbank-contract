const state = {};
const web3 = require('web3');

const instantiateContract = (web3) => {
  state.Bloodbank = new web3.eth.Contract(Bloodbank.abi, Bloodbank.netorks["5777"].address);
  
};

const startListening = () => {
  listenToBookslot();
}

const updateAccountState = async (address) => {
    state.currentAccount = address;
    await changeView(state.currentAccount);
};

getWeb3().then(
    async (data)=>{
      state.web3 = data;
      state.accounts = await state.web3.eth.getAccounts();
      instantiateContract(state.web3);
      startListening();
  }
);