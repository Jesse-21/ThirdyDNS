import React, { FormEvent, useContext, useEffect, useState } from "react";
import { getENS } from "../service/ensService";
import addressesEqual, { getEnsContract, labelHash, nameHash } from "../utils";
import toast from "react-hot-toast";
import { Notification } from "./Notification";
import { MetamaskContext } from "./MetamaskProvider";

interface Props {}

const ROOT_NODE = ".awesome";
export const SearchENS = (props: Props) => {
  const [name, setName] = useState("");

  const { connectedAccount, getBalance, ethereum } = useContext(MetamaskContext);

  const ensContract = getEnsContract(ethereum);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    let cleanName = name;
    if (name) {
      if (!name.endsWith(ROOT_NODE)) {
        cleanName + ROOT_NODE;
      }
    } else {
      alert("Empty name");
    }
    if (connectedAccount && ensContract) {
      const exists = await ensContract.recordExists(nameHash(`${name}.awesome`));
      if (exists) {
        alert("This name already taken");
        return;
      }

      const tx = await ensContract.register(name, connectedAccount);
      toast.custom((t) => <Notification t={t} txHash={tx.hash} />);
    } else {
      alert("Connect wallet");
    }
  }

  return (
    <div className="mt-6 bg-transparent rounded-xl lg:w-1/3 ring-0 shadow-[#6441A5] shadow-homogen">
      <form onSubmit={onSubmit} className="flex flex-wrap justify-between md:flex-row">
        <div className="relative w-full">
          <label htmlFor="domainName" className="sr-only">
            Domain Name
          </label>

          <input
            type="text"
            id="domainName"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value.trim())}
            placeholder="Search your next ENS. (Ex: sercan.awesome)"
            className="block w-full h-20 pl-4 pr-16 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-secondary rounded-xl sm:text-xl"
          />

          <button
            type="submit"
            className="absolute p-2 text-primary transform -translate-y-1/2 bg-secondary rounded-full shadow-[#af9de4] shadow-md hover:bg-secondary right-4 top-1/2"
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
