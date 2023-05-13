import React, { FormEvent, useContext, useEffect, useState } from "react";
import { getENS } from "../service/ensService";
import addressesEqual, { getEnsContract, labelHash, nameHash } from "../utils";
import toast from "react-hot-toast";
import { Notification } from "./Notification";
import { MetamaskContext } from "./MetamaskProvider";

interface Props {}

const ROOT_NODE = ".thirdy";
export const SearchENS = (props: Props) => {
  const [name, setName] = useState("");

  const { connectWallet, ethereum } = useContext(MetamaskContext);

  const ensContract = getEnsContract(ethereum);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    let cleanName = name;

    if (!name) return;

    if (name) {
      if (name.endsWith(ROOT_NODE)) {
        cleanName = name.substring(0, name.length - ROOT_NODE.length);
      }
    }

    let account = await connectWallet();
    if (account && ensContract) {
      const exists = await ensContract.recordExists(nameHash(`${cleanName}`));
      if (exists) {
        toast.error("Domain already exists");
        return;
      }

      try {
        const tx = await ensContract.register(cleanName, account);
        toast.custom((t) => <Notification t={t} txHash={tx.hash} />);
      } catch (e) {
        toast.error("Maximum domain limit reached");
      }
    } else {
      toast.error("Connect your wallet to register a domain");
    }
  }

  return (
    <div className="w-full mt-6 bg-transparent shadow-lg rounded-xl lg:w-1/2 ring-0">
      <form onSubmit={onSubmit} className="flex flex-wrap justify-between md:flex-row">
        <div className="relative w-full mx-10 lg:mx-0">
          <label htmlFor="domainName" className="sr-only">
            Domain Name
          </label>

          <input
            type="text"
            id="domainName"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder="Search your next domain"
            className="block w-full h-20 pl-4 pr-16 text-lg text-gray-700 placeholder-gray-400 border-0 focus:ring-2 focus:ring-pink-500 rounded-xl sm:text-xl"
          />

          <button
            type="submit"
            className="absolute p-4 text-white transform -translate-y-1/2 bg-pink-500 rounded-lg shadow-md right-4 top-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};
