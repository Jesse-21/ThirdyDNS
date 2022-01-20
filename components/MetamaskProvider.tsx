import { useEffect, useState, createContext, FC } from "react";
import { ethers } from "ethers";

export type AppContextProps = {
  connectedAccount: string | undefined;
  getBalance: Function;
  getProvider: Function;
};

export const MetamaskContext = createContext<AppContextProps>({} as AppContextProps);

type Props = {
  children: React.ReactNode;
};

export const MetamaskProvider = ({ children }: Props) => {
  const [ethereum, setEthereum] = useState<any>(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);

  const getBalance = async () => {
    if (ethereum) {
      await ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      return await signer.getBalance();
    }
    return null;
  };

  const getProvider = async () => {
    if (!ethereum) {
      return null;
    }
    return new ethers.providers.Web3Provider(ethereum);
  };

  const connectWallet = async () => {
    if (!ethereum) return;
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setConnectedAccount(accounts[0]);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const setEthereumFromWindow = async () => {
    const w = window as unknown as Window & { ethereum: any };

    if (w && w.ethereum) {
      w.ethereum.on("chainChanged", () => w.location.reload());
      const chainId = await w.ethereum.request({ method: "eth_chainId" });
      const rinkebyId = "0x4";
      const localNetworkId = "0x7a69";
      if (chainId === rinkebyId || chainId === localNetworkId) {
        setEthereum(w.ethereum);
      } else {
        alert("Please use Rinkeby network");
      }
    }
  };

  useEffect(() => {
    connectWallet();
  }, [ethereum]);

  useEffect(() => {
    setEthereumFromWindow();
  }, []);

  return (
    <MetamaskContext.Provider value={{ getBalance, getProvider, connectedAccount }}>
      {children}
    </MetamaskContext.Provider>
  );
};
