// SPDX-License-Identifier: agpl-3.0

pragma solidity ^0.8.0;

import "../../UserOperation.sol";

interface IEntryPoint {
  function handleOps(UserOperation[] calldata ops, address payable redeemer) external;

  // function simulateWalletValidation(UserOperation calldata op)
  //   external
  //   returns (uint256 gasUsedByPayForSelfOp);

  // function simulatePaymasterValidation(
  //   UserOperation calldata op,
  //   uint256 gasUsedByPayForSelfOp
  // ) external view returns (bytes memory context, uint256 gasUsedByPayForOp);
}

interface IEntryPointStakeController {
  function addStake() external payable;

  function lockStake() external;

  function unlockStake() external;

  function withdrawStake(address payable withdrawAddress) external;
}
