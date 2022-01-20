import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { SearchENS } from "../components/SearchENS";

let domainPattern = new RegExp(
  "(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?.)+[a-z0-9][a-z0-9-]{0,61}[awesome]"
);

const Home: NextPage = () => {
  return (
    <>
      <img src="/ab.png" className="absolute w-full h-full -z-20" />
      <div className="flex flex-col items-center justify-start h-screen pt-64 space-y-10 text-white ">
        <h1 className="text-6xl text-center">
          Your next <span className="text-[#ff7500]">.awesome</span> domain is here. <br /> Claim
          it!
        </h1>
        <SearchENS />
      </div>
    </>
  );
};

export default Home;
