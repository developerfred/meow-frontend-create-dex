
//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { TokenExchange, MEOW_ADDRESS, EXCHANGE_ADDRESS } from '@codingsheth/meow-sdk';
import { getAddress, formatEther } from 'viem';
import { toWei } from '@/lib/utils';
import GlassTable from '@/components/GlassTable';
import NavBar from '../layout/navbar';
import Footer from '@/components/Footer';
import { useAccount, useTransactionConfirmations } from 'wagmi';
import useExchangeStore from '@/store/useExchangeStore';

const tokenExchange = new TokenExchange();

const ExchangePage: React.FC = () => {
    const account = useAccount();

    //@ts-nocheck
    const { isApprovalNeeded, tokenSymbol, isBuying, exchangeAmount, allowance,  tokenAddress, setTokenAddress, amount, setAmount, setTransactionHash, transactionHash, setError, error, setExchangeAmount, setIsBuying, setTokenSymbol, setIsApprovalNeeded, setAllowance     } = useExchangeStore();

    const isValidForCheck = (tokenAddress: string, amount: string, accountAddress: string): boolean => {
        return !!tokenAddress && !!amount && !!accountAddress;
    };


    const allowanceAmount = async (exchangeAddress: string, tokenAddress: string, owner: string) => {
        const result = await tokenExchange.checkAllowance(getAddress(exchangeAddress), getAddress(tokenAddress), getAddress(owner));

        return result;
    }

    const updateApprovalStatus = async (tokenAddress: string, weiAmount: string, accountAddress: string) => {
        const targetAddress = isBuying ? MEOW_ADDRESS : tokenAddress;
        const allowance: bigint = await allowanceAmount(EXCHANGE_ADDRESS, targetAddress, accountAddress);
        const weiAmountBigInt: bigint = BigInt(weiAmount);

        setIsApprovalNeeded(allowance < weiAmountBigInt);
        setAllowance(allowance);
    };

    const checkApprovalNeeded = async () => {
        const weiAmount = toWei(amount);
        await updateApprovalStatus(tokenAddress, weiAmount, account.address);
    };


    const tokens = [
        { address: '0x141A97A07118207801A25500438F03C1c267999D', symbol: 'DGN', creator: '0xCreator' },
    ];



    useEffect(() => {
        const initCheckApprovalNeeded = async () => {
            if (!isValidForCheck(tokenAddress, amount, account.address)) {
                setIsApprovalNeeded(false);
                return;
            }

            await checkApprovalNeeded();
        };

        initCheckApprovalNeeded();
    }, [tokenAddress, amount, account.address, isBuying]);



    const approveTokens = async () => {
        const weiAmount = toWei(amount);
        console.log("ApproveTokens", weiAmount);

        const targetAddress = isBuying ? getAddress(MEOW_ADDRESS) : getAddress(tokenAddress);

        try {
            const txResponse = await tokenExchange.approveTokens(targetAddress, weiAmount);
            setTransactionHash(txResponse); 
            console.log(`Hash da transação de aprovação: ${txResponse}`);
        } catch (error) {
            console.error('Erro ao aprovar tokens:', error);
            setError('Falha ao aprovar tokens. Por favor, tente novamente.');
        }
    };


    const handleTransaction = async () => {
        try {
            const weiAmount = toWei(amount);
            //@ts-ignore
            await checkApprovalNeeded();

            if (isApprovalNeeded) {
                setError('Approval needed before transaction.');
                return;
            }


            //@ts-ignore
            const transactionHash = isBuying
                //@ts-ignore
                ? await tokenExchange.buyTokens([getAddress(tokenAddress), weiAmount])
                //@ts-ignore
                : await tokenExchange.sellTokens([getAddress(tokenAddress), weiAmount]);

            console.log(`Transaction hash: ${transactionHash}`);
            setTransactionHash(transactionHash);
            setError('');
        } catch (err) {
            console.error(err);
            setError(`Failed to ${isBuying ? 'buy' : 'sell'} tokens. Please try again.`);
        }
    };

    const handleCalculateExchange = async () => {
        if (!tokenAddress || !amount) return;

        const weiAmount = toWei(amount);
        try {            
            const symbol = await tokenExchange.getTokenSymbol(getAddress(tokenAddress));
            //@ts-ignore
            const calculatedAmount = await tokenExchange.calculateExchangeAmount([getAddress(tokenAddress), weiAmount, isBuying]);
            setExchangeAmount(formatEther(calculatedAmount));
            setTokenSymbol(symbol.toString());            
        } catch (err) {
            setError('Failed to calculate exchange amount');
        }
    };

   

    return (
        <div className="items-center bg-black">
            < NavBar />
            <div className="flex justify-center items-center h-screen bg-black">
                <div className="w-[500px] shadow-2xl border border-gray-50 rounded-3xl p-4 bg-white/10 backdrop-blur-md text-white">
                    <h1 className="text-2xl font-bold mb-4">Token Exchange</h1>                    
                    <input
                        className="border border-gray-50 p-2 mb-4 w-full rounded-xl bg-black/20 placeholder-gray-300 text-white"
                        type="text"
                        placeholder="Token Address"
                        value={tokenAddress}
                        onChange={(e) => setTokenAddress(e.target.value)}
                    />

                    <input
                        className="border border-gray-50 p-2 mb-4 w-full rounded-xl bg-black/20 placeholder-gray-300 text-white"
                        type="text"
                        placeholder="Amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        onBlur={handleCalculateExchange}
                    />

                    <div className="flex justify-between items-center text-sm mb-4">
                        <button
                            className="bg-black/30 text-white py-2 px-4 rounded-xl hover:bg-black/50 transition-colors"
                            onClick={() => setIsBuying(!isBuying)}
                        >
                            Toggle Buy/Sell
                        </button>
                        <span>{isBuying ? 'Buying' : 'Selling'}</span>
                    </div>

                    {exchangeAmount && (
                        <div className="text-center mb-4">
                            Estimated Exchange Amount: {exchangeAmount} {isBuying ? tokenSymbol : 'MEOW'}
                        </div>
                    )}
                    {isApprovalNeeded ? (
                        <button
                            onClick={approveTokens}
                            className="bg-[#e5ff54] text-lg hover:bg-[#d8ff00] text-black font-medium w-full py-4 px-8 rounded-2xl transition-colors"
                        >
                            Approve
                        </button>
                    ) : (
                        <button
                            className="bg-[#e5ff54] text-lg hover:bg-[#d8ff00] text-black font-medium w-full py-4 px-8 rounded-2xl transition-colors"
                            onClick={handleTransaction}
                        >
                            {isBuying ? 'Buy Tokens' : 'Sell Tokens'}
                        </button>
                    )}

                    {transactionHash && (
                        <div className="mt-4 text-green-500">
                            Transaction successful: {transactionHash}
                        </div>
                    )}
                    {error && (
                        <div className="mt-4 text-red-500">
                            Error: {error}
                        </div>
                    )}
                </div>

            </div>
            <div className="flex items-center bg-black">

                <GlassTable tokens={tokens} />

            </div>
            <Footer />
        </div>


    );

};

export default ExchangePage;
