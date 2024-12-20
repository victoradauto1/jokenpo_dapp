import Web3, { Contract } from "web3";
import ABI from "./abi.json";

import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

type LoginResult = {
  account: string;
  isAdmin: boolean;
};

export type Player = {
  wallet: string;
  wins: bigint;
}

export type LeaderBoard = {
  players?: Player[];
  result?: string;
};

const ADAPTER_ADDRESS = `${process.env.NEXT_PUBLIC_CONTRACT_ADDRESS}`;

function getWeb3() {
  if (!window.ethereum) throw new Error("There is no MetaMask.");
  return new Web3(window.ethereum);
}

function getContract(web3: Web3) {
  if (!web3) web3 = getWeb3();
  return new web3.eth.Contract(ABI, ADAPTER_ADDRESS, {
    from: localStorage.getItem("account") || undefined,
  });
}

export async function doLogin(): Promise<LoginResult> {
  const web3 = getWeb3();

  const accounts = await web3.eth.requestAccounts();

  if (!accounts || !accounts.length)
    throw new Error("Wallet not found/allowed.");

  const contract = getContract(web3);

  const ownerAddress = (await contract.methods.owner().call()) as string;

  localStorage.setItem("account", accounts[0]);
  localStorage.setItem("isAdmin", `${accounts[0] === ownerAddress}`);

  return {
    account: accounts[0],
    isAdmin: accounts[0] === ownerAddress,
  } as LoginResult;
}

export function doLogout() {
  localStorage.removeItem("account");
  localStorage.removeItem("isAdmin");
}

export type Dashboard = {
  bid?: string;
  comission?: number;
  address?: string;
};

export async function getDashboard(): Promise<Dashboard> {
  const web3 = getWeb3();
  const contract = getContract(web3);
  const addressResult = await contract.methods.getAddress().call();

  const address = addressResult ? String(addressResult) : "0x0";

  if (/^(0x0+)$/.test(address)) {
    return {
      bid: Web3.utils.toWei("0.01", "ether"),
      comission: 10,
      address,
    } as Dashboard;
  }

  const bid = await contract.methods.getBid().call();
  const comission = await contract.methods.getComission().call();
  return { bid, comission, address } as Dashboard;
}

export async function upgrade(newContract: string): Promise<string> {
  const web3 = getWeb3();
  const contract = getContract(web3);

  const tx = await contract.methods.upgrade(newContract).send();

  return tx.transactionHash;
}

export async function setComission(newComission: number): Promise<string> {
  const web3 = getWeb3();
  const contract = getContract(web3);

  const tx = await contract.methods.setComission(newComission).send();

  return tx.transactionHash;
}

export async function setBid(newBid: string): Promise<string> {
  const web3 = getWeb3();
  const contract = getContract(web3);

  const tx = await contract.methods.setBid(newBid).send();

  return tx.transactionHash;
}

export enum Options {
  NONE = 0,
  ROCK = 1,
  PAPER = 2,
  SCISSOR = 3,
}

export async function play(option: Options): Promise<string> {
  const web3 = getWeb3();
  const contract = getContract(web3);
  const bid = await contract.methods.getBid().call();
  
  const tx = await contract.methods.play(option).send({
    value: String(bid || web3.utils.toWei("0.01", "ether"))  
  });

  return tx.transactionHash;
}


export async function getResult(): Promise<string>{
  const web3 = getWeb3();
  const contract = getContract(web3);
  return await contract.methods.getResult().call();

}

export async function getLeaderboard(): Promise<LeaderBoard>{
  const web3 = getWeb3();
  const contract = getContract(web3);
  const players = await contract.methods.getLeaderboard().call();
  const result = await contract.methods.getResult().call();
  return {
    players, result
  } as LeaderBoard
}
