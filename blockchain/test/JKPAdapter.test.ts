import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
  import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect } from "chai";
  import hre, { ethers } from "hardhat";
  
  describe("JKPAdapter", function () {
  
    enum Options { NONE, ROCK, PAPER, SCISSOR };
  
    const DEFAULT_BID = ethers.parseEther("0.01");
    const DEFAULT_COMISSION = 10n;
  
    async function JokenpoFixture() {
  
  
      const [owner, player1, player2 ] = await hre.ethers.getSigners();
  
      const Jokenpo = await hre.ethers.getContractFactory("Jokenpo");
      const jokenpo = await Jokenpo.deploy();

      const JKPAdapter = await hre.ethers.getContractFactory("JKPAdapter");
      const jkadapter = await JKPAdapter.deploy();
  
      return { jokenpo, jkadapter, owner, player1, player2};
    }
  
    describe("Deployment", function () {
      it("Should get adress", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        const address = await jokenpo.getAddress()
        await jkadapter.upgrade(jokenpo);

        const implementatioAddress = await jkadapter.getImplementationAddress();

        expect(implementatioAddress).to.equal(address);
      });
  
      it("Should get bid", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await jkadapter.upgrade(jokenpo);

        const bid = await jkadapter.getBid();

        expect(bid).to.equal(DEFAULT_BID);
      });
    
      it("Should NOT get bid(no upgrade)", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await expect(jkadapter.getBid()).to.be.revertedWith("You must upgrade first");
      });

      it("Should get comission", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await jkadapter.upgrade(jokenpo);

        const comission = await jkadapter.getComission();
            
        expect(comission).to.equal(DEFAULT_COMISSION);
      });

      it("Should NOT get comission (no upgrade)", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await expect(jkadapter.getComission()).to.be.revertedWith("You must upgrade first");
      });

      it("Should NOT upgrade (not owner)", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        const instance = jkadapter.connect(player1)

        await expect(instance.upgrade(jokenpo)).to.be.revertedWith("You do not have permission to do it");
      });

      it("Should NOT upgrade (empty address)", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);


        await expect(jkadapter.upgrade(ethers.ZeroAddress)).to.be.revertedWith("Empty address is not valid");
      });

      it("it Should play alone by adapter", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await jkadapter.upgrade(jokenpo);

        const instance = jkadapter.connect(player1);

        await instance.play(Options.PAPER, {value: DEFAULT_BID})
        
        const result = await instance.getResult();

        expect(result).to.equal("Player 1 chooses an option. Waiting for Player 2.")
      });

      it("it Should play along", async function () {
        const { jokenpo, jkadapter, owner, player1, player2  } = await loadFixture(JokenpoFixture);

        await jkadapter.upgrade(jokenpo);

        const instance = jkadapter.connect(player1);
        await instance.play(Options.PAPER, {value: DEFAULT_BID});
       
        const instance2 = jkadapter.connect(player2)
        await instance2.play(Options.ROCK, {value: DEFAULT_BID})
        const result = await instance.getResult();

        expect(result).to.equal("Paper covers the Rock, Player 1 won.")
      });

    });
  });
  
  