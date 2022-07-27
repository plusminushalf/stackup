// SPDX-License-Identifier: AGPL-3.0

pragma solidity 0.8.9;
import "hardhat/console.sol";

contract Greeter {
  function greet() external view returns (string memory) {
    console.log("yaha to aya h but kese?");
    return "Hey";
  }
}
