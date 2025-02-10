import { fromBase64 } from "@mysten/bcs";
import { Transaction } from "@mysten/sui/transactions";

const handleSwap = (txBytes: string) => {
    console.log("txBytes", txBytes);
    const txb = fromBase64(txBytes);
    const tx = Transaction.from(txb);

    return tx;
 }


export default handleSwap;