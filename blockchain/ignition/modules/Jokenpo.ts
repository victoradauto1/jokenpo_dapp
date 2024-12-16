// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const JokenpoModule = buildModule("JokenpoModule", (m) => {

  const jokenpo = m.contract("Jokenpo");

  return { jokenpo };
});

export default JokenpoModule;