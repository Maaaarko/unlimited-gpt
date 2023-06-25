"use client"

import { MouseEvent, useEffect, useState } from "react"
import CustomButton from "./CustomButton"
import { ChatBoxProps, MessageListProps, MessageProps } from "@/types"
import MDXRemoteWrapper from "@/components/MDXRemoteWrapper"
import { useChat } from "ai/react"
import { v4 } from "uuid"
import { serialize } from "next-mdx-remote/serialize"
import rehypePrism from "rehype-prism-plus"
import rehypeCodeTitles from "rehype-code-titles"
import { MDXRemoteProps } from "next-mdx-remote"

// include consolas font
import {} from "next/font/google"

function Message({ content, role, isLoading }: MessageProps) {
    const boxColor = role == "user" ? "bg-grey/50" : "bg-grey/30"
    const [parsedContent, setParsedContent] = useState<MDXRemoteProps>()

    useEffect(() => {
        const evaluate = async () => {
            const html = await serialize(content, {
                mdxOptions: {
                    development: process.env.NODE_ENV === "development",
                    rehypePlugins: [rehypePrism, rehypeCodeTitles],
                },
            })
            setParsedContent(html)
        }
        if (!isLoading) {
            evaluate()
        }
    }, [content, isLoading])

    return (
        <div className={`${boxColor} p-8`}>
            {parsedContent ? (
                <MDXRemoteWrapper {...parsedContent} />
            ) : (
                <p>{content}</p>
            )}
        </div>
    )
}

function MessageList({ messages, isLoading }: MessageListProps) {
    return (
        <div className="flex flex-col">
            {messages
                .filter((message) => message.role != "system")
                .map((message, index) => (
                    <Message
                        key={index}
                        content={message.content}
                        role={message.role}
                        isLoading={isLoading}
                    />
                ))}
        </div>
    )
}

export default function ChatBox({ model }: ChatBoxProps) {
    const [systemPrompt, setSystemPrompt] = useState<MessageProps>({
        content: "",
        role: "system",
    })
    const [messagePrompt, setMessagePrompt] = useState<MessageProps>({
        content: "",
        role: "user",
    })

    const {
        messages: allMessages,
        setMessages: setAllMessages,
        reload,
        isLoading,
    } = useChat({
        api: "/api/completion",
        body: {
            model,
        },
    })

    const handleSystemPromptChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setSystemPrompt({
            content: event.target.value,
            role: "system",
        })
    }

    const handleMessagePromptChange = (
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        setMessagePrompt({
            content: event.target.value,
            role: "user",
        })
    }

    const submitPrompt = async (event: MouseEvent<HTMLButtonElement>) => {
        if (messagePrompt == null) {
            return
        }

        let newAllMessages = [...allMessages]
        if (systemPrompt.content != "") {
            const newSystemPrompt = {
                content: systemPrompt.content,
                role: "system" as const,
                id: v4(),
            }

            const allMessagesWithoutSystemPrompt = allMessages.filter(
                (message) => message.role != "system"
            )

            newAllMessages = [
                newSystemPrompt,
                ...allMessagesWithoutSystemPrompt,
            ]
        }

        const newMessagePrompt = {
            content: messagePrompt.content,
            role: "user" as const,
            id: v4(),
        }
        console.log([...newAllMessages, newMessagePrompt])
        setAllMessages([...newAllMessages, newMessagePrompt])
        reload({
            headers: {
                "Content-Type": "application/json",
            },
        })

        setMessagePrompt({
            content: "",
            role: "user",
        })
    }

    return (
        <div className="w-full max-h-[80vh] flex-1 flex flex-row gap-8">
            <div className="hidden md:block  self-stretch w-1/4">
                <textarea
                    className="bg-grey/30 p-2.5 h-full w-full resize-none rounded-md border border-white/30 outline-none focus:border-primary-blue "
                    placeholder="Describe the system..."
                    value={systemPrompt?.content}
                    onChange={handleSystemPromptChange}
                />
            </div>
            <div className="relative overflow-auto bg-grey/30 w-full md:w-3/4 self-stretch rounded-md border border-white/30 flex flex-col justify-between">
                <div>
                    <MessageList messages={allMessages} isLoading={isLoading} />
                </div>
                <form className="bg-black sticky bottom-0 flex flex-row items-center gap-6 p-2.5 border-white/30">
                    <textarea
                        className="bg-grey/30 p-2 w-full resize-none rounded-md border border-white/30 outline-none focus:border-primary-blue "
                        placeholder="Type your message..."
                        value={messagePrompt?.content}
                        onChange={handleMessagePromptChange}
                    />
                    <CustomButton
                        text="Send"
                        type="submit"
                        containerStyles="bg-primary-blue rounded-full text-white"
                        handleClick={submitPrompt}
                    />
                </form>
            </div>
        </div>
    )
}
