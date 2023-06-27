import { ModelName } from "@/types"
import { Message } from "ai"

import { encodingForModel } from "js-tiktoken"

let encoding = encodingForModel("gpt-3.5-turbo")

export default function countTokensInContext(context: Message[], modelName: ModelName): number {
    let tokenCount = 0

    for (const message of context) {
        const encoded = encoding.encode(message.content)
        tokenCount += encoded.length
    }
    return tokenCount
}
