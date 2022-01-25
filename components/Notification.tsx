import React from "react";
import classNames from "classnames";

import toast, { Toast } from "react-hot-toast";
import { ethers } from "ethers";
import { MdOutlineClose } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
type Props = {
  t: Toast;
  txHash: string;
};
export const Notification = ({ t, txHash }: Props) => {
  return (
    <div>
      Custom and <b>bold</b>
      <p>{txHash}</p>
      <button onClick={() => toast.dismiss(t.id)}>Dismiss</button>
    </div>
  );
};
