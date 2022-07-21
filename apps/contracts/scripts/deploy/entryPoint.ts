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
  return ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "address", "uint"],
      [encodeOp(op), entryPoint, chainId]
    )
  );
}

function encodeSignatures(type: number, signature: any): string {
  return ethers.utils.defaultAbiCoder.encode(
    ["uint8", "(address signer, bytes signature)[]"],
    [type, [signature]]
  );
}

async function main() {
  const [factoryDeployer, walletOwner, bundler, testReceiver, paymasterSigner] =
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

  // Get Greeter Contract Deployed
  console.log("----------- DEPLOY GREETER -----------");
  const Greeter = await ethers.getContractFactory("Greeter");
  const GreeterInitCode = Greeter.getDeployTransaction().data;
  const GreeterSalt = ethers.utils.formatBytes32String(String.fromCharCode(0));
  const greeterDeployTx = await singletonFactory.deploy(
    GreeterInitCode,
    GreeterSalt
  );
  await greeterDeployTx.wait();

  const greeterAddress = await singletonFactory.computeAddress(
    GreeterSalt,
    GreeterInitCode
  );
  console.log("Greeter Addr: ", greeterAddress);

  console.log("----------- END DEPLOY GREETER -----------");

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

  const entryPoint = await ethers.getContractAt(
    "EntryPoint",
    entryPointAddress,
    bundler
  );

  console.log("----------- END DEPLOY ENTRY POINT -----------");

  // Get Paymaster Contract Deployed
  console.log("----------- DEPLOY PAYMASTER -----------");
  const Paymaster = await ethers.getContractFactory("DappPaymaster");
  const PaymasterInitCode =
    Paymaster.getDeployTransaction(entryPointAddress).data;
  const PaymasterSalt = ethers.utils.formatBytes32String(
    String.fromCharCode(0)
  );
  const paymasterDeployTx = await singletonFactory.deploy(
    PaymasterInitCode,
    PaymasterSalt
  );
  await paymasterDeployTx.wait();

  const paymasterAddress = await singletonFactory.computeAddress(
    PaymasterSalt,
    PaymasterInitCode
  );
  console.log("Paymaster Addr: ", paymasterAddress);

  const paymaster = await ethers.getContractAt(
    "DappPaymaster",
    paymasterAddress,
    paymasterSigner
  );

  paymasterSigner.sendTransaction({
    to: paymasterAddress,
    value: ethers.utils.parseEther("10"),
  });

  await paymaster.initialize(paymasterSigner.address, []);

  const addStakeTx = await paymaster.entryPointInteraction(
    EntryPoint.interface.encodeFunctionData("addStake", [UNCLOCK_DELAY]),
    {
      value: ethers.utils.parseEther("1"),
    }
  );

  await addStakeTx.wait();

  const resp = await entryPoint.isStaked(paymasterAddress);
  console.log("Paymaster is staked? ", resp);

  console.log("----------- END DEPLOY PAYMASTER -----------");

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

  console.log("----------- GET WALLET ADDR & SEND ETH -----------");

  const walletProxyAddress = await entryPoint.getSenderAddress(
    WalletProxyDeployInitCode,
    WalletProxyDeploySalt
  );

  const provider = ethers.provider;
  const walletOwnerBalanceOld = ethers.utils.formatEther(
    await provider.getBalance(walletOwner.address)
  );
  console.log("walletOwnerBalance", walletOwnerBalanceOld);
  await walletOwner.sendTransaction({
    to: walletProxyAddress,
    value: ethers.utils.parseEther("10"),
  });
  console.log("Wallet To be Addr: ", walletProxyAddress);

  const walletProxyBalance = ethers.utils.formatEther(
    await provider.getBalance(walletProxyAddress)
  );
  console.log("walletProxyBalance", walletProxyBalance);
  const walletOwnerBalance = ethers.utils.formatEther(
    await provider.getBalance(walletOwner.address)
  );
  console.log("walletOwnerBalance", walletOwnerBalance);
  console.log("----------- END WALLET ADDR & SEND ETH -----------");

  const walletProxyContract = await ethers.getContractAt(
    "WalletProxy",
    walletProxyAddress
  );

  const userOp = {
    sender: walletProxyAddress,
    nonce: 0,
    initCode: String(WalletProxyDeployInitCode),
    callData: Wallet.interface.encodeFunctionData("executeUserOp", [
      greeterAddress,
      0,
      Greeter.interface.encodeFunctionData("greet", []),
    ]),
    callGas: bn(5000000),
    verificationGas: bn(5000000),
    preVerificationGas: bn(5000000),
    maxFeePerGas: bn(5000000),
    maxPriorityFeePerGas: bn(5000000),
    paymaster: paymasterAddress,
    paymasterData: "0x",
    signature: "0x",
  };

  console.log("----------- BUILD & SEND USER OP -----------");

  const requestId = encodeRequestId(userOp, entryPointAddress, 31337);

  const signature = await walletOwner.signMessage(
    ethers.utils.arrayify(requestId)
  );

  userOp.signature = encodeSignatures(0, {
    signer: walletOwner.address,
    signature,
  });

  const tx = await entryPoint.handleOps([userOp], bundler.address);
  const receipt = await tx.wait();
  //   console.log(receipt);

  console.log("----------- END BUILD & SEND USER OP -----------");

  console.log(
    "walletProxyBalance",
    ethers.utils.formatEther(await provider.getBalance(walletProxyAddress))
  );
  console.log(
    "walletOwnerBalance",
    ethers.utils.formatEther(await provider.getBalance(walletOwner.address))
  );

  console.log(
    "testReceiverBalance",
    ethers.utils.formatEther(await provider.getBalance(testReceiver.address))
  );

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
