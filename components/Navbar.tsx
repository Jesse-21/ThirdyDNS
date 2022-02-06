import React, { Fragment, useContext, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import addressesEqual, { getEnsContract } from "../utils";
import { MetamaskContext } from "./MetamaskProvider";
import toast from "react-hot-toast";

type Props = {};

const Navbar = (props: Props) => {
  let [open, setOpen] = useState(false);

  const [domains, setDomains] = useState([]);
  const { connectedAccount, connectWallet, getBalance, ethereum } = useContext(MetamaskContext);

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
          console.log("Domain Registered");

          if (connectedAccount && addressesEqual(owner, connectedAccount)) {
            toast.success(`You now own an awesome domain!`);
            getUserDomains();
          }
        });
      }
    };
    subscribeToEvents();
  }, [ethereum, connectedAccount]);

  return (
    <header>
      <div className="flex items-center justify-between h-16 p-10 mx-auto sm:p-12 max-w-screen-2xl lg:px-8">
        <div className="flex items-center justify-between w-full">
          <button type="button" onClick={() => setOpen(true)} className="order-last p-2 text-white sm:mr-4 lg:hidden">
            <svg
              className="w-8 h-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <a href="" className="flex w-32 rounded-lg">
            <img src="/ANS.png" className="object-fit" />
          </a>
        </div>

        <div className="flex items-center justify-end flex-1">
          <nav className="hidden lg:uppercase lg:items-center lg:text-white lg:tracking-wide lg:font-bold lg:text-xl lg:space-x-4 lg:flex">
            {connectedAccount ? (
              <button
                className="block w-40 h-16 border-b-4 border-transparent hover:text-primary hover:border-current"
                onClick={() => setOpen(true)}
              >
                My Domains ({domains && domains.length})
              </button>
            ) : (
              <button className="block h-12 px-4 text-white bg-pink-500 rounded-lg" onClick={() => connectWallet()}>
                Connect
              </button>
            )}
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
                    {/*  <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-200"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      
                    </Transition.Child> */}
                    <div className="flex flex-col h-full py-6 overflow-y-scroll bg-white shadow-xl">
                      <div className="flex items-center px-4 space-x-4 sm:px-6">
                        <div className="inline-flex p-2 -ml-2 ">
                          <button
                            type="button"
                            className="p-2 rounded-md focus:outline-none hover:bg-primary hover:text-white focus:ring-2 focus:ring-white"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="w-8 h-8" aria-hidden="true" />
                          </button>
                        </div>
                        <Dialog.Title className="inline-block text-3xl font-semibold uppercase text-primary">
                          My Domains ({domains && domains.length})
                        </Dialog.Title>
                      </div>
                      <div className="relative flex-1 px-4 mt-6 sm:px-6">
                        <ul className="space-y-4">
                          {domains.map((domain, idx) => (
                            <li key={idx}>
                              <h1 className="p-3 text-xl font-semibold text-transparent border-2 border-gray-200 rounded-2xl bg-clip-text bg-gradient-to-r from-purple-600 via-blue-500 to-pink-500">
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
