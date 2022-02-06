import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, Fragment, useContext, useEffect, useState } from "react";
import { MetamaskContext } from "../components/MetamaskProvider";
import Navbar from "../components/Navbar";
import { SearchENS } from "../components/SearchENS";
import { getEnsContract } from "../utils";

const Home: NextPage = () => {
  return (
    <>
      {/*  <img src="/bg.png" className="absolute w-full h-full -z-20" /> */}
      <div className="absolute w-full h-full -z-20 bg-gradient-to-r from-sky-500 to-[#34139E]"></div>
      <Navbar />
      <div className="flex flex-col items-center justify-start h-full pt-48 space-y-10 overflow-hidden text-white ">
        <h1 className="text-6xl text-center">
          Your next <span className="text-secondary">.awesome</span> domain is here. <br /> Claim it!
        </h1>
        <SearchENS />
      </div>
    </>
  );
};

export default Home;
