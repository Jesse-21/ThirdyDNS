import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <>
      <div className="fixed">
        <img src="/bg3.svg" className="w-[500px] h-[500px]" />
      </div>
      <div className="flex flex-col items-center justify-start h-screen pt-64 space-y-10 text-white bg-black">
        {/*  <img src="/bg2.svg" className="absolute w-full h-full " /> */}

        <h1 className="text-4xl">Your next awesome domain is here. Claim it!</h1>
        <div className="w-1/3 mb-40">
          <div className="relative w-full shadow-sm ">
            <input
              type="text"
              name="name"
              className="block w-full pr-24 text-black border-none h-14 focus:ring-primary sm:text-sm"
              placeholder="Search your next ENS name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center h-14">
              <div className=" absolute inset-y-0 right-0 flex items-center px-4 ml-3 font-semibold  pointer-events-none bg-[#ab1251]">
                SEARCH
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
