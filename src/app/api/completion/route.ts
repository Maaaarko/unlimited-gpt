import { OpenAIStream, StreamingTextResponse } from "ai"
import { Configuration, OpenAIApi } from "openai-edge"

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

export const runtime = "edge"

export async function POST(request: Request) {
    const { messages, model } = await request.json()
    const response = await openai.createChatCompletion({
        model: model,
        stream: true,
        messages: messages.map((message: any) => ({
            content: message.content,
            role: message.role,
        })),
    })

    const stream = OpenAIStream(response)

    return new StreamingTextResponse(stream)
}
