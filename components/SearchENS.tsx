import React, { FormEvent, useContext, useEffect, useState } from "react";
import { getENS, getRegistrar, getResolver } from "../service/ensService";
import { labelHash, nameHash } from "../utils";
import { MetamaskContext } from "./MetamaskProvider";

interface Props {}

export const SearchENS = (props: Props) => {
  const [name, setName] = useState("");

  const { connectedAccount, getBalance, getProvider } = useContext(MetamaskContext);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const provider = await getProvider();
    if (connectedAccount && provider) {
      const signer = await provider.getSigner();
      const registrar = getRegistrar(signer);
      const resolver = getResolver(signer);
      const ens = getENS(signer);

      const exists = await ens.recordExists(nameHash(`${name}.awesome`));
      if (exists) {
        alert("This name already taken");
        return;
      }

      let tx = await registrar.register(labelHash(name), connectedAccount);
      await tx.wait();

      let tx2 = await ens.setResolver(nameHash(`${name}.awesome`), resolver.address);
      await tx2.wait();

      //TODO setAddr with resolver to resolve domain to actual wallet address

      console.log("New owner ", await ens.owner(nameHash(`${name}.awesome`)));
      console.log("Resolver ", await ens.resolver(nameHash(`${name}.awesome`)));
    } else {
      alert("Connect wallet");
    }
  }

  return (
    <div className="mt-6 bg-transparent rounded-md lg:w-1/3 ring-0 shadow-[#645ecf] shadow-homogen">
      <form onSubmit={onSubmit} className="flex flex-wrap justify-between md:flex-row">
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search your next ENS. (Ex: sercan.awesome)"
          className="flex-1 px-4 text-xl text-gray-700 placeholder-gray-400 border-none rounded-l-lg appearance-none lg:h-16 focus:outline-none focus:placeholder-transparent ring-0"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-full text-white transition-colors duration-200 transform rounded-r-lg lg:w-16 lg:h-16 lg:p-0 bg-[#ff4a14] hover:bg-[#ff805a] focus:outline-none focus:bg-[#ff805a]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  );
};
