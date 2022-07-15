import { ethers } from "hardhat";
import { contracts } from "@stackupfinance/walletjs";
import { bn } from "../../test/utils/helpers/numbers";
import { ZERO_ADDRESS } from "../../test/utils/helpers/constants";

function encodeOp(op: any): string {
  return ethers.utils.keccak256(
    ethers.utils.solidityPack(
      [
        "address",
        "uint256",
        "bytes32",
        "bytes32",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "address",
        "bytes32",
      ],
      [
        op.sender,
        op.nonce,
        ethers.utils.keccak256(op.initCode),
        ethers.utils.keccak256(op.callData),
        op.callGas,
        op.verificationGas,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        op.paymaster,
        ethers.utils.keccak256(op.paymasterData),
      ]
    )
  );
}

function encodeRequestId(op: any, entryPoint: string, chainId: number): string {
  const params = [encodeOp(op), entryPoint, chainId];
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(["bytes32", "address", "uint"], params)
  );
}

function encodeSignatures(type: number, signature: any): string {
  const params = [type, [signature]];
  return ethers.utils.defaultAbiCoder.encode(
    ["uint8", "(address signer, bytes signature)[]"],
    params
  );
}

async function main() {
  const [factoryDeployer, stackup, walletOwner, bundler] =
    await ethers.getSigners();

  // Deploy factory
  console.log("----------- DEPLOY FACTORY -----------");
  const SingletonFactory = await ethers.getContractFactory(
    "SingletonFactory",
    factoryDeployer
  );
  const singletonFactory = await SingletonFactory.deploy();
  await singletonFactory.deployed();
  console.log("Factory Addr: ", singletonFactory.address);
  console.log("-----------END DEPLOY FACTORY -----------");

  // Get EntryPoint Contract Code
  console.log("----------- DEPLOY ENTRY POINT -----------");
  const EntryPoint = await ethers.getContractFactory("EntryPoint");
  const UNCLOCK_DELAY = 5 * 60;
  const entryPointDeployInitCode = EntryPoint.getDeployTransaction(
    singletonFactory.address,
    UNCLOCK_DELAY
  ).data;
  const entryPointDeploySalt = ethers.utils.formatBytes32String(
    String.fromCharCode(0)
  );
  const entryPointDeployTx = await singletonFactory.deploy(
    entryPointDeployInitCode,
    entryPointDeploySalt
  );
  await entryPointDeployTx.wait();

  const entryPointAddress = await singletonFactory.computeAddress(
    entryPointDeploySalt,
    entryPointDeployInitCode
  );
  console.log("Entry Point Addr: ", entryPointAddress);

  console.log("----------- END DEPLOY ENTRY POINT -----------");

  // Deploy wallet implementation
  console.log("----------- DEPLOY WALLET IMPLEMENTATION -----------");
  const Wallet = await ethers.getContractFactory("Wallet");
  const walletInitCode = Wallet.getDeployTransaction(entryPointAddress).data;
  const walletDeploySalt = ethers.utils.formatBytes32String(
    String.fromCharCode(0)
  );
  const walletDeployTx = await singletonFactory.deploy(
    walletInitCode,
    walletDeploySalt
  );
  await walletDeployTx.wait();

  const walletImplementationAddress = await singletonFactory.computeAddress(
    walletDeploySalt,
    walletInitCode
  );

  console.log("Wallet Implementation Addr: ", walletImplementationAddress);
  console.log("----------- END DEPLOY WALLET IMPLEMENTATION -----------");

  // make wallet proxy with right owner intialisation
  const WalletProxy = await ethers.getContractFactory("WalletProxy");
  const WalletProxyDeployInitCode = WalletProxy.getDeployTransaction(
    walletImplementationAddress,
    Wallet.interface.encodeFunctionData("initialize", [walletOwner.address, []])
  ).data;
  const WalletProxyDeploySalt = ethers.utils.formatBytes32String(
    String.fromCharCode(0)
  );

  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    entryPointAddress,
    bundler
  );

  console.log("----------- GET WALLET ADDR & SEND ETH -----------");

  const walletProxyAddress = await entryPoint.getSenderAddress(
    WalletProxyDeployInitCode,
    WalletProxyDeploySalt
  );

  await walletOwner.sendTransaction({
    to: walletProxyAddress,
    value: ethers.utils.parseEther("1"),
  });
  console.log("Wallet To be Addr: ", walletProxyAddress);
  console.log("----------- END WALLET ADDR & SEND ETH -----------");

  const userOp = {
    sender: walletProxyAddress,
    nonce: WalletProxyDeploySalt,
    initCode: WalletProxyDeployInitCode,
    callData: "0x",
    callGas: bn(5000000),
    verificationGas: bn(5000000),
    preVerificationGas: bn(5000000),
    maxFeePerGas: bn(5000000),
    maxPriorityFeePerGas: bn(5000000),
    paymaster: ZERO_ADDRESS,
    paymasterData: "0x",
    signature: "0x",
  };

  console.log("----------- BUILD & SEND USER OP -----------");
  const network = await ethers.getDefaultProvider().getNetwork();
  const encodedRequestId = encodeRequestId(
    userOp,
    entryPointAddress,
    network.chainId
  );

  const signature = await walletOwner.signMessage(
    ethers.utils.arrayify(encodedRequestId)
  );

  userOp.signature = encodeSignatures(0, {
    signer: walletOwner.address,
    signature,
  });

  const tx = await entryPoint.handleOps([userOp], bundler.address, {
    gasLimit: 5000000,
  });
  console.log(tx);

  console.log("----------- END BUILD & SEND USER OP -----------");

  // const SingletonFactoryte = contracts.SingletonFactory.getInstance(signer);

  // const tx = await SingletonFactory.deploy(
  //   contracts.EntryPoint.deployInitCode,
  //   contracts.EntryPoint.deploySalt,
  //   {
  //     gasLimit: 5000000,
  //   }
  // ).then((tx: any) => tx.wait());

  // console.log("EntryPoint deployment transaction:", tx);
  // console.log("EntryPoint will be deployed to:", contracts.EntryPoint.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
