import React, { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import addressesEqual, { getEnsContract } from "../utils";
import { MetamaskContext } from "./MetamaskProvider";
import toast from "react-hot-toast";
import { ethers } from "ethers";
type Props = {};

const Navbar = (props: Props) => {
  let [open, setOpen] = useState(false);

  const [domains, setDomains] = useState([]);
  const { connectedAccount, getBalance, ethereum } = useContext(MetamaskContext);

  useEffect(() => {
    getUserDomains();
  }, [open, ethereum, connectedAccount]);

  const getUserDomains = async () => {
    const ensContract = getEnsContract(ethereum);
    if (ensContract && connectedAccount) {
      setDomains(await ensContract.getNames(connectedAccount));
    }
  };

  useEffect(() => {
    const subscribeToEvents = async () => {
      const ensContract = getEnsContract(ethereum);
      if (ensContract) {
        ensContract.on("DomainRegistered", async (label, owner) => {
          if (connectedAccount && addressesEqual(owner, connectedAccount)) {
            toast.success(`You now own the ${label}.awesome domain!`);
            getUserDomains();
          }
        });
      }
    };
    subscribeToEvents();
  }, [ethereum]);

  return (
    <header>
      <div className="flex items-center justify-between h-16 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button type="button" className="p-2 sm:mr-4 lg:hidden">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="" className="flex">
            <span className="inline-block w-32 h-10 bg-gray-200 rounded-lg">.A</span>
          </a>
        </div>

        <div className="flex items-center justify-end flex-1">
          <nav className="hidden lg:uppercase lg:items-center lg:text-white lg:tracking-wide lg:font-bold lg:text-lg lg:space-x-4 lg:flex">
            <button className="block h-10 px-4 bg-white rounded-lg text-primary" onClick={() => setOpen(true)}>
              Connect
            </button>
            <button
              className="block h-16 border-b-4 border-transparent hover:text-secondary hover:border-current"
              onClick={() => setOpen(true)}
            >
              My Domains ({domains && domains.length})
            </button>
          </nav>
        </div>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={() => setOpen(false)}>
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
              </Transition.Child>
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-200"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <div className="relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-200"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-0 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="text-gray-300 rounded-md hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="w-6 h-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                      <div className="px-4 sm:px-6">
                        <Dialog.Title className="text-3xl font-semibold text-gray-700 uppercase">
                          My Domains ({domains && domains.length})
                        </Dialog.Title>
                      </div>
                      <div className="relative flex-1 px-4 mt-6 sm:px-6">
                        <ul className="space-y-4">
                          {domains.map((domain, idx) => (
                            <li key={idx}>
                              <h1 className="p-4 text-xl font-semibold text-transparent border-2 border-gray-200 rounded-2xl bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
                                {domain}.awesome
                              </h1>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </div>
    </header>
  );
};

export default Navbar;
