import { ethers } from "ethers";
import * as EntryPoint from "../contracts/entryPoint";
import * as userOperations from "../constants/userOperations";
import * as message from "./message";

export const appendGuardianSignature = (
  userOp: userOperations.IUserOperation,
  signedUserOp: userOperations.IUserOperation
) => {
  const ws1 =
    userOp.signature !== userOperations.nullCode
      ? ethers.utils.defaultAbiCoder.decode(
          ["uint8", "(address signer, bytes signature)[]"],
          userOp.signature
        )
      : [undefined, []];
  const ws2 = ethers.utils.defaultAbiCoder.decode(
    ["uint8", "(address signer, bytes signature)[]"],
    signedUserOp.signature
  );
  const signatureSet = new Set<any>([]);
  const walletSignatureValues = [
    ...ws1[1].map((v: any) => ({ signer: v.signer, signature: v.signature })),
    ...ws2[1].map((v: any) => ({ signer: v.signer, signature: v.signature })),
  ].filter((v) => {
    if (signatureSet.has(v.signer)) return false;

    signatureSet.add(v.signer);
    return true;
  });

  return {
    ...userOp,
    signature: ethers.utils.defaultAbiCoder.encode(
      ["uint8", "(address signer, bytes signature)[]"],
      [1, walletSignatureValues]
    ),
  };
};

export const get = (
  sender: string,
  override: Partial<userOperations.IUserOperation> = {}
): userOperations.IUserOperation => {
  return {
    ...userOperations.defaults,
    sender,
    ...override,
  };
};

export const sign = async (
  signer: ethers.Signer,
  chainId: ethers.BigNumberish,
  op: userOperations.IUserOperation
): Promise<userOperations.IUserOperation> => {
  const walletSignatureValues = [
    {
      signer: await signer.getAddress(),
      signature: await signer.signMessage(
        ethers.utils.arrayify(
          message.requestId(op, EntryPoint.address, chainId)
        )
      ),
    },
  ];

  return {
    ...op,
    signature: ethers.utils.defaultAbiCoder.encode(
      ["uint8", "(address signer, bytes signature)[]"],
      [0, walletSignatureValues]
    ),
  };
};

export const signAsGuardian = async (
  signer: ethers.Signer,
  chainId: ethers.BigNumberish,
  op: userOperations.IUserOperation
): Promise<userOperations.IUserOperation> => {
  const ws =
    op.signature !== userOperations.nullCode
      ? ethers.utils.defaultAbiCoder.decode(
          ["uint8", "(address signer, bytes signature)[]"],
          op.signature
        )
      : [undefined, []];

  const walletSignatureValues = [
    ...ws[1].map((v: any) => ({ signer: v.signer, signature: v.signature })),
    {
      signer: await signer.getAddress(),
      signature: await signer.signMessage(
        ethers.utils.arrayify(
          message.requestId(op, EntryPoint.address, chainId)
        )
      ),
    },
  ];

  return {
    ...op,
    signature: ethers.utils.defaultAbiCoder.encode(
      ["uint8", "(address signer, bytes signature)[]"],
      [1, walletSignatureValues]
    ),
  };
};

export const signPaymasterData = async (
  op: userOperations.IUserOperation,
  signer: ethers.Wallet,
  paymaster: string,
  paymasterData: message.PaymasterData
): Promise<userOperations.IUserOperation> => {
  const userOp = { ...op, paymaster };
  const paymasterSignatureValue = await signer.signMessage(
    message.paymasterData(
      userOp,
      paymasterData.fee,
      paymasterData.mode,
      paymasterData.token,
      paymasterData.feed
    )
  );
  const paymasterSignature = ethers.utils.defaultAbiCoder.encode(
    ["uint8", "(address signer, bytes signature)[]"],
    [
      0,
      [
        {
          signer: await signer.getAddress(),
          signature: paymasterSignatureValue,
        },
      ],
    ]
  );

  return {
    ...userOp,
    paymasterData: ethers.utils.defaultAbiCoder.encode(
      ["uint256", "uint8", "address", "address", "bytes"],
      [
        paymasterData.fee,
        paymasterData.mode,
        paymasterData.token,
        paymasterData.feed,
        paymasterSignature,
      ]
    ),
  };
};
