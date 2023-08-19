import React from "react";

import { Toast } from "react-hot-toast";
import { DocumentSearchIcon } from "@heroicons/react/outline";
type Props = {
  t: Toast;
  txHash: string;
};
export const Notification = ({ t, txHash }: Props) => {
  return (
    <div role="alert" className="flex p-4 text-xl text-green-600 bg-white border border-b-4 border-current rounded-lg">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-6 h-6">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>

      <div className="ml-3">
        <p className="font-bold">Registration in progress...</p>

        <a
          href={`https://goerli.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center mt-3 text-sm text-blue-600 underline "
        >
          <DocumentSearchIcon className="inline-block w-6 h-6" />
          {txHash}
        </a>
      </div>
    </div>
  );
};
