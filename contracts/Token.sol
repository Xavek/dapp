// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

// With this we can write Javascript code inside solidity file
// Mainly used for used for debugging the Smart contract.
// we can combine the JS and Sol code also
// import "hardhat/console.sol";
// Smaple usage of this feature is at line 24.
// The logs are logged during the npx hardhat test.

contract Token {
    string public name = "Hardhat Token";
    string public symbol = "HTT";
    uint256 public totalSupply = 10000;

    address public owner;
    mapping(address => uint256) balances;

    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        // console.log("This amount is send from %s amount %s", to, amount);
        require(balances[msg.sender] >= amount, "Not enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
