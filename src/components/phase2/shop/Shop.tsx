import {
  useAllowance,
  useApproveERC20,
  useApproveERC721,
  useIsApprovedERC721,
} from '@hooks/useApprove';
import { useBalanceERC1155, useBalanceERC20, useBalanceERC721 } from '@hooks/useBalance';
import { BigNumber, constants } from 'ethers';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';

import { SelectToken, Token, TokenStandard } from '@components/phase2/SelectToken';
import { ARBITRUM, MAGIC_ADDRESS, SHOP, SMOL_AGE_BONES, SMOL_AGE_TREASURE } from '@config';
import { Phase2Context } from '@context/phase2Context';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Tool } from '@model/model';
import { ToolsListRow } from './ToolListRow';
import { InventoryIcon } from '../InventoryIcon';

export const tools: Tool[] = [
  { name: 'Shovel', image: '/static/images/phase2/shovel.gif', tokenId: BigNumber.from(1) },
  { name: 'Satchel', image: '/static/images/phase2/satchel.gif', tokenId: BigNumber.from(2) },
  { name: 'Pick Axe', image: '/static/images/phase2/pickaxe.gif', tokenId: BigNumber.from(3) },
];

export const ShopComponent = () => {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { mintLaborTools } = useContext(Phase2Context);
  const tokens: Token[] = useMemo(
    () => [
      {
        id: 0,
        name: 'MAGIC',
        address: MAGIC_ADDRESS[chain?.id ?? ARBITRUM],
        type: TokenStandard.ERC20,
        pricePerTool: 10,
      },
      {
        id: 1,
        name: 'BONES',
        address: SMOL_AGE_BONES[chain?.id ?? ARBITRUM],
        type: TokenStandard.ERC20,
        pricePerTool: 1000,
      },
      {
        id: 2,
        name: 'MOON ROCKS',
        address: SMOL_AGE_TREASURE[chain?.id ?? ARBITRUM],
        type: TokenStandard.ERC1155,
        pricePerTool: 5,
      },
    ],
    [chain],
  );

  const [token, setToken] = useState<Token>();

  const { data: balance } =
    token?.type == TokenStandard.ERC20
      ? useBalanceERC20(token?.address, address)
      : token?.type == TokenStandard.ERC721
      ? useBalanceERC721(token?.address, address)
      : useBalanceERC1155(token?.address, address, BigNumber.from(1)); // treasure token id is hardcoded to 1
  const { data: allowance, refetch: refetchAllowance } =
    token?.type == TokenStandard.ERC20
      ? useAllowance(token?.address, address, SHOP[chain?.id ?? ARBITRUM])
      : useIsApprovedERC721(token?.address, address, SHOP[chain?.id ?? ARBITRUM], true); // we can use useIsApprovedERC721 for both erc721 and erc1155
  const { approve, success: approvingTxSucceed } =
    token?.type == TokenStandard.ERC20
      ? useApproveERC20(token?.address, SHOP[chain?.id ?? ARBITRUM], constants.MaxUint256)
      : useApproveERC721(token?.address, SHOP[chain?.id ?? ARBITRUM]); // we can use useApproveERC721 for both erc721 and erc1155
  const isApproved = useMemo(() => {
    return token?.type == TokenStandard.ERC20 ? (allowance as BigNumber)?.gt(0) : allowance; // allowance is boolean type in case of non erc20 token type
  }, [allowance, token]);

  const [amounts, setAmounts] = useState<number[]>(Array(tools.length).fill(0));
  const totalAmount = useMemo(() => amounts.reduce((sum, value) => sum + value, 0), [amounts]);
  const price: BigNumber | number = useMemo(() => {
    if (!token || totalAmount == 0) return 0;
    if (token.type == TokenStandard.ERC20) {
      return BigNumber.from(token.pricePerTool).mul(BigNumber.from(10).pow(18)).mul(totalAmount); // decimals is hardcoded to 18
    } else {
      return token.pricePerTool * totalAmount;
    }
  }, [token, totalAmount]);

  useEffect(() => {
    refetchAllowance();
  }, [approvingTxSucceed]);

  const purchase = async () => {
    if (totalAmount == 0) {
      toast.warn('Nothing to purchase');
      return;
    }
    if (BigNumber.from(balance).lt(BigNumber.from(price))) {
      toast.error('Insufficient balance');
      return;
    }
    const data = amounts.map((value, index) => ({ value, index })).filter((item) => item.value > 0);
    const success = await mintLaborTools(
      data.map((item) => tools[item.index].tokenId),
      data.map((item) => item.value),
      Array(data.length).fill(token.id),
    );
    if (success) {
      setAmounts(Array(tools.length).fill(0));
    }
  };

  return (
    <div className="relative min-h-screen bg-[url('/static/images/phase2/shop.gif')] bg-cover bg-center max-xs:overflow-x-scroll pb-10">
      {address && (<div className="flex justify-end items-end ml-auto mr-8 md:mr-16 gap-6 pb-2 pt-[7.5rem]">
        <InventoryIcon />
      </div>)}
      <div className="mx-auto w-full max-w-xl self-center px-4 pb-10 pt-10">
        <div className="relative bg-black/60 px-2 py-6 sm:p-6 rounded-2xl">
          <Link href="/phase2/labor-grounds">
            <Image
              src="/static/images/back.png"
              height={200}
              width={200}
              alt="Back Button"
              className="absolute left-[-10px] top-1/2 w-[60px] -translate-y-1/2 sm:left-[-30px]"
            />
          </Link>
          <h2 className="pb-6 text-center text-base font-bold uppercase tracking-widest text-white">
            Choose tools
          </h2>
          <div className="flex w-full flex-col items-center pb-6">
            {tools.map((tool: Tool, index: number) => (
              <ToolsListRow
                tool={tool}
                amount={amounts[index]}
                updateAmount={(amount) => {
                  const _amounts = [...amounts];
                  _amounts.splice(index, 1, amount);
                  setAmounts(_amounts);
                }}
                key={tool.name}
              />
            ))}
          </div>
          {token && (
            <div className="flex justify-center mb-2">
              <div className="flex flex-col w-[70%] sm:w-[80%] p-3 border-4 border-smolBrownLight bg-smolBrown text-center">
                <span className="text-sm mb-2">Token price</span>
                <span className="text-xs leading-7">Per tool: {token.pricePerTool}<br />Total: {totalAmount * token.pricePerTool}</span>
              </div>
            </div>
          )}
          <div className="mt-5 flex w-full flex-col items-center justify-center gap-6 sm:flex-row">
            <SelectToken updateToken={setToken} tokens={tokens} />
            <button
              disabled={!token}
              onClick={() => (isApproved ? purchase() : approve())}
              className="flex h-9 items-center rounded-xl border-4 border-smolBrownLight bg-smolBrown p-2 px-4 text-[.60rem] uppercase sm:self-end"
            >
              {isApproved || !token ? `Purchase` : `Approve`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
