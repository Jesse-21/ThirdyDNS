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

      const tx = await ensContract.register(labelHash(name), connectedAccount);
      toast.success(`Transaction submitted ${tx.hash}`);
    } else {
      alert("Connect wallet");
    }
  }

  const addEventHandlers = () => {
    if (ensContract && connectedAccount) {
      ensContract.on("DomainRegistered", (labelBytes, owner) => {
        if (connectedAccount && addressesEqual(owner, connectedAccount)) {
          toast("You now own the .awesome domain!");
        }
      });
    }
  };

  useEffect(() => {
    addEventHandlers();
  }, []);

  return (
    <div className="mt-6 bg-transparent rounded-md lg:w-1/3 ring-0 shadow-[#6441A5] shadow-homogen">
      <form onSubmit={onSubmit} className="flex flex-wrap justify-between md:flex-row">
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          placeholder="Search your next ENS. (Ex: sercan.awesome)"
          className="flex-1 px-4 text-xl text-gray-700 placeholder-gray-400 border-none rounded-l-lg appearance-none lg:h-16 focus:outline-none focus:placeholder-transparent ring-0"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-full text-[#6441A5] transition-colors duration-200 transform rounded-r-lg lg:w-16 lg:h-16 lg:p-0 bg-[#FDD835] hover:bg-[#dfbc23] focus:outline-none focus:bg-[#dfbc23]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-9 h-9"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </form>
    </div>
  );
};
