const SurgeryFactory = require("./contracts/SurgeryFactory.sol/SurgeryFactory.json");
const Surgery = require("./contracts/Surgery.sol/Surgery.json");
const { ethers } = require("ethers");
require("dotenv").config({path:'../.env'});

const main = async () => {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    console.log(CONTRACT_ADDRESS);
    
    const provider = new ethers.providers.JsonRpcProvider(
        process.env.POLYGON_MUMBAI_RPC
    );

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        SurgeryFactory.abi,
         provider
    );

    const getDeployedSurgery = contract.filters.newSurgeryEvent();

    console.log(getDeployedSurgery);
    
    let events = await contract.queryFilter(getDeployedSurgery);
    let event = events.reverse();
    console.log(events);

//   const PUBLIC_ADDRESS = "0x621f5BA34d96fC26d9837B4deF93d311744a7991";

//   const provider = new ethers.providers.JsonRpcProvider(
//     PUBLIC_ADDRESS
//   );

//   const contract = new ethers.Contract(
//     PUBLIC_ADDRESS,
//     Surgery.abi,
//     provider
//   );

 // const Donations = contract.filters.donated('0xc538779A628a21D7CCA7b1a3E57E92f5226C3E27');
//   const AllDonations = await contract.queryFilter(Donations);

//   const DonationsData =  AllDonations.map((e) => {
//     return {
//       donar: e.args.donar,
//       amount: parseInt(e.args.amount),
//       timestamp : parseInt(e.args.timestamp)
//   }});

//   console.log(DonationsData);


};

main();
