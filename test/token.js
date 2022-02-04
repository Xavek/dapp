const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token Contract", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr2, addr1, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });

    describe("Transactions", function () {
      it("Should transfer tokens between accounts", async function () {
        await hardhatToken.transfer(addr1.address, 5);
        const addr1Balance = await hardhatToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(5);

        await hardhatToken.connect(addr1).transfer(addr2.address, 2);
        const addr2Balance = await hardhatToken.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(2);
      });

      it("Should fail if Sender does not have enough tokens", async function () {
        const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
        await expect(
          hardhatToken.connect(addr1).transfer(owner.address, 1)
        ).to.be.revertedWith("Not enough tokens");
        expect(await hardhatToken.balanceOf(owner.address)).to.equal(
          initialOwnerBalance
        );
      });

      it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await hardhatToken.balanceOf(owner.address);
        await hardhatToken.transfer(addr1.address, 6);
        await hardhatToken.transfer(addr2.address, 7);

        const finalOwnerBalance = await hardhatToken.balanceOf(owner.address);
        expect(finalOwnerBalance).to.equal(initialOwnerBalance - 13);

        const addr1Balance = await hardhatToken.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(6);

        const addr2Balance = await hardhatToken.balanceOf(addr2.address);
        expect(addr2Balance).to.equal(7);
      });
    });
  });
});
