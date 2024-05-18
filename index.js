import hre from 'hardhat';
import solc from 'solc';

(async function test1() {
  const source = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Echo {
  // This view function takes an uint256 argument and returns the same value
  function echo(uint256 value) public pure returns (uint256) {
      return value;
  }
}
`;

  // compile the contract
  const input = {
    language: 'Solidity',
    sources: {
      'TestVerifier.sol': {
        content: source,
      },
    },
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object'],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const contractName = Object.keys(output.contracts['TestVerifier.sol'])[0];
  const bytecode = output.contracts['TestVerifier.sol'][contractName].evm.bytecode.object;
  const abi = output.contracts['TestVerifier.sol'][contractName].abi;

  // deploy the contract
  const signer = (await hre.ethers.getSigners())[0];
  const ContractFactory = new hre.ethers.ContractFactory(abi, bytecode, signer);
  const contract = await ContractFactory.deploy();
  await contract.waitForDeployment();

  // interaction with the contract
  console.log(await contract.echo(69420));
})();
