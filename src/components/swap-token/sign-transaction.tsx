import { fromBase64 } from "@mysten/bcs";
import { Transaction } from "@mysten/sui/transactions";

interface SignTransactionProps {
    txBytes: string;
}

const handleSwap = ({ txBytes }: SignTransactionProps) => {
    const txb = fromBase64(txBytes);
    const tx = Transaction.from(txb);

    return tx;
 }


export default handleSwap;