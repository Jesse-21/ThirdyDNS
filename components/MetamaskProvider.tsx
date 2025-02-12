import { useEffect, useState, createContext } from "react";
import { ethers } from "ethers";
import toast from "react-hot-toast";

export type AppContextProps = {
  connectedAccount: string | undefined;
  getBalance: Function;
  connectWallet: Function;
  ethereum: any;
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

  const connectWallet = async () => {
    if (!ethereum) return;
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setConnectedAccount(accounts[0]);
      return accounts[0];
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const setEthereumFromWindow = async () => {
    const w = window as unknown as Window & { ethereum: any };

    if (w && w.ethereum) {
      w.ethereum.on("chainChanged", () => w.location.reload());
      const chainId = await w.ethereum.request({ method: "eth_chainId" });
      const goerliId = "0x5";
      const localNetworkId = "0x7a69";
      if (chainId === goerliId || chainId === localNetworkId) {
        setEthereum(w.ethereum);
      } else {
        toast.error("Please connect to the Goerli");
      }
    }
  };

  useEffect(() => {
    setEthereumFromWindow();
  }, []);

  /*   useEffect(() => {
    async function connectWallet() {
      if (!ethereum) return;
      try {
        const accounts = await ethereum.request({ method: "eth_requestAccounts" });
        setConnectedAccount(accounts[0]);
      } catch (error) {
        console.log("Error ", error);
      }
    }
    connectWallet();
  }, [ethereum]); */

  return (
    <MetamaskContext.Provider value={{ getBalance, ethereum, connectWallet, connectedAccount }}>
      {children}
    </MetamaskContext.Provider>
  );
};
