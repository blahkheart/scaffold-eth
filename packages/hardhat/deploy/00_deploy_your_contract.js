// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("YourCollectible", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: [
      "Cool NFT", // Name
      "YCB", // Symbol
      "https://ipfs.io/ipfs/bafybeiblu3m2de4tytbopoyvuoismacxlzz3oduqtihzz67xu3exwtagpe/", // IPFS URL TO UPLOADED JSON DIRECTORY
      "" // Not revealed URI, can be set to empty string or different URL if you don't want tp reveal your collection at deployment
    ],
    log: true,
  });

  
    // Getting a previously deployed contract
    const YourCollectible = await ethers.getContract("YourCollectible", deployer);
    // await YourCollectible.setPurpose("Hello");

    // To take ownership of YourCollectible using the ownable library uncomment next line and add the
    // address you want to be the owner.
  const owner = "0x1486767EfF6109725F929c041CBA242D5A52c7E1";
  const tx = await YourCollectible.transferOwnership(owner);
  console.log(`"transferring ownership to ${owner} with hash: "`, tx.hash);
  console.log("transferred ownership to ", owner);

    //const yourContract = await ethers.getContractAt('YourContract', "0xaAC799eC2d00C013f1F11c37E654e59B0429DF6A") //<-- if you want to instantiate a version of a contract at a specific address!


  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const yourContract = await deploy("YourContract", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const yourContract = await deploy("YourContract", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */
};
module.exports.tags = ["YourCollectible"];

/*
Tenderly verification
let verification = await tenderly.verify({
  name: contractName,
  address: contractAddress,
  network: targetNetwork,
});
*/
