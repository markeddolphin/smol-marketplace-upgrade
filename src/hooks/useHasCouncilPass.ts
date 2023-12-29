import { COUNCIL_PASS_ADDRESS } from "@config"
import { CouncilPass__factory } from "@typechain"
import { BigNumber } from "ethers"
import { erc721ABI, useAccount, useContractRead } from "wagmi"

export const useHasCouncilPass = ({
    chainId,
}: {
    chainId: number
}) => {
    const { address } = useAccount()


    const { data: hasCouncilPass, isLoading, error } = useContractRead({
        address: COUNCIL_PASS_ADDRESS[chainId],
        abi: CouncilPass__factory.abi,
        functionName: 'balanceOf',
        args: [address, BigNumber.from(0)],
        chainId,
    })

    return {
        hasCouncilPass: hasCouncilPass?.gt(0),
        isLoading,
        error,
    }
}