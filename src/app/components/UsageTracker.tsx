import { UsageTrackerProps } from "@/types"
import Image from "next/image"
import React, { useEffect, useState } from "react"

const costsPerModel = {
    "gpt-3.5-turbo": {
        input: 0.0015,
        output: 0.002,
    },
    "gpt-3.5-turbo-16k": {
        input: 0.003,
        output: 0.004,
    },
    "gpt-4": {
        input: 0.03,
        output: 0.06,
    },
    "gpt-4-32k": {
        input: 0.06,
        output: 0.12,
    },
}

export default function UsageCounter({ nextRequest }: UsageTrackerProps) {
    const [nextCost, setNextCost] = useState<number>(0)

    useEffect(() => {
        if (nextRequest == null) {
            return
        }

        const { model, tokenCount } = nextRequest
        const tokenBatches = Math.floor(tokenCount / 1000) + 1

        let inputCost = costsPerModel[model].input * tokenBatches
        let outputCost = costsPerModel[model].output * tokenBatches

        const nextCost = inputCost + outputCost
        console.log("currently using " + tokenCount + " tokens")
        console.log(nextCost)
        setNextCost(nextCost)
    }, [nextRequest])

    return (
        <div className="text-white font-semibold">
            <span className="flex justify-end gap-1 text-grey">
                <Image className="object-contain" src="/info-icon.svg" alt="info-icon" width={16} height={16} />
                Estimated cost for next request: <span className="text-primary-blue">${nextCost}</span>
            </span>
        </div>
    )
}
