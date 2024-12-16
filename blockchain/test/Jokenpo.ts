import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("Jokenpo", function () {

  enum Options { NONE, ROCK, PAPER, SCISSOR };

  const DEFAULT_BID = ethers.parseEther("0.01");

  async function JokenpoFixture() {


    const [owner, player1, player2 ] = await hre.ethers.getSigners();

    const Jokenpo = await hre.ethers.getContractFactory("Jokenpo");
    const jokenpo = await Jokenpo.deploy();

    return { jokenpo, owner, player1, player2};
  }

  describe("Deployment", function () {
    it("Should get leaderbord", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID} );

      const player2Instance = jokenpo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID})

      const leaderboard = await jokenpo.getLeadersBoard();
      expect(leaderboard[0].wallet).to.equal(player1.address);
      expect(leaderboard[0].wins).to.equal(1);
      expect(leaderboard.length).to.equal(1);
    });

    it("Should set bid", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const newBid = ethers.parseEther("0.02")

      await jokenpo.setBid(newBid);

      const updatedBid = await jokenpo.getBid();
      expect(updatedBid).to.equal(newBid);
    });

    it("Should NOT set bid (not alowed account)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      const newBid = ethers.parseEther("0.02")

      await expect(player1Instance.setBid(newBid)).to.be.revertedWith("You do not have permission to do it");
    });

    it("Should NOT set bid (game in progress)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      const newBid = ethers.parseEther("0.02");

      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});


      await expect(jokenpo.setBid(newBid)).to.be.revertedWith("You can not change the bid with a game in progress");
    });

    it("Should set comission", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const newComission = 11n;

      await jokenpo.setBid(newComission);

      const updatedComission = await jokenpo.getBid();
      expect(updatedComission).to.equal(newComission);
    });

    it("Should NOT set comission (not alowed account)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const newComission = 11n;

      const player2Instance = jokenpo.connect(player2);

      await expect(player2Instance.setComission(newComission)).to.be.revertedWith("You do not have permission to do it");
    });

    it("Should NOT set comission (game in progress)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const newComission = 11n;

      const player2Instance = jokenpo.connect(player2);
      await player2Instance.play(Options.SCISSOR, {value: DEFAULT_BID})
      await expect(jokenpo.setComission(newComission)).to.be.revertedWith("You can not change the comission with a game in progress");
    });

    it("Should play alone", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID} );

      const result = await jokenpo.getResult();

      expect(result).to.equal("Player 1 chooses an option. Waiting for Player 2.");
  
    });

    it("Should play along", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID} );

      const player2Instance = jokenpo.connect(player2);
      await player2Instance.play(Options.ROCK, {value: DEFAULT_BID})

      const result = await jokenpo.getResult();
      expect(result).to.equal("Paper covers the Rock, Player 1 won.");
    });

    it("Should NOT play alone (owner)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      await expect(jokenpo.play(Options.PAPER, { value: DEFAULT_BID})).to.be.revertedWith("The owner can not play");
    });

    it("Should NOT play (wrong choice option)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await expect(player1Instance.play(Options.NONE, { value: DEFAULT_BID})).to.be.revertedWith("Invalid choice");
    });

    it("Should NOT play (twice in a row)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await player1Instance.play(Options.PAPER, { value: DEFAULT_BID});
      await expect(player1Instance.play(Options.ROCK, { value: DEFAULT_BID})).to.be.revertedWith("You have already played");
    });

    it("Should NOT play (wrong bid)", async function () {
      const { jokenpo, owner, player1, player2  } = await loadFixture(JokenpoFixture);

      const player1Instance = jokenpo.connect(player1);
      await expect(player1Instance.play(Options.ROCK, { value: 0})).to.be.revertedWith("Invalid bid");
    });
  });
});

