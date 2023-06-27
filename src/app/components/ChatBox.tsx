"use client"

import { MouseEvent, useEffect, useState } from "react"
import CustomButton from "./CustomButton"
import { ChatBoxProps, MessageFeedItem, MessageListProps, MessageProps, UsageReport } from "@/types"
import MDXRemoteWrapper from "@/components/MDXRemoteWrapper"
import { useChat } from "ai/react"
import { serialize } from "next-mdx-remote/serialize"
import rehypePrism from "rehype-prism-plus"
import rehypeCodeTitles from "rehype-code-titles"
import { MDXRemoteProps } from "next-mdx-remote"
import Image from "next/image"
import { v4 } from "uuid"
import updateMessageFeed from "../lib/updateMessageFeed"
import countTokensInContext from "../lib/countTokensInContext"
import UsageCounter from "./UsageTracker"

function Message({ content, role, userName, userIconUrl = "/logo.png", isLoading, deleteMessage }: MessageProps) {
    const boxColor = role == "user" ? "bg-grey/50" : "bg-grey/40"
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
        <div className={`${boxColor} pl-4 pr-8 py-4 flex flex-col gap-4 items-start`}>
            <div className="w-full flex flex-row justify-between">
                <div className={`shrink-0 flex justify-start items-center gap-x-2 gap-y-1`}>
                    <Image
                        src={userIconUrl}
                        alt="UnlimitedGPT logo"
                        width={32}
                        height={32}
                        className="object-contain rounded"
                    />{" "}
                    <span className="text-white font-semibold text-md">{userName}</span>
                </div>
                <Image
                    src="/delete-icon.svg"
                    alt="Delete message icon"
                    className="cursor-pointer object-contain hover:opacity-50 hover:scale-105 transition-opacity"
                    width={24}
                    height={24}
                    onClick={deleteMessage}
                />
            </div>
            <div className="w-full border border-white/10"></div>

            <div className="mx-2">{parsedContent ? <MDXRemoteWrapper {...parsedContent} /> : <p>{content}</p>}</div>
        </div>
    )
}

function MessageList({ messages, isLoading, handleDeleteMessage }: MessageListProps) {
    return (
        <div className="flex flex-col">
            {messages
                .filter((message) => message.role != "system")
                .map((message, index) => (
                    <Message
                        key={index}
                        id={message.id}
                        content={message.content}
                        role={message.role}
                        userName={message.userName}
                        userIconUrl={message.userIconUrl}
                        isLoading={isLoading}
                        deleteMessage={() => {
                            handleDeleteMessage(message.id)
                        }}
                    />
                ))}
        </div>
    )
}

export default function ChatBox({ model }: ChatBoxProps) {
    const [messageFeed, setMessageFeed] = useState<MessageFeedItem[]>([])
    const [systemPrompt, setSystemPrompt] = useState<string>("")
    const [messagePrompt, setMessagePrompt] = useState<string>("")
    const [nextUsageReport, setNextUsageReport] = useState<UsageReport>({ model: model, tokenCount: 0 })

    const useChatSettings = { api: "/api/completion", body: { model } }
    const {
        messages: allMessages,
        setMessages: setAllMessages,
        append,
        reload,
        stop,
        isLoading,
    } = useChat(useChatSettings)

    useEffect(() => {
        if (allMessages.length == 0) {
            return
        }
        const updatedMessageFeed = updateMessageFeed(allMessages, messageFeed, model)
        setMessageFeed(updatedMessageFeed)
    }, [allMessages])

    useEffect(() => {
        if (!isLoading && (allMessages.length > 0 || messagePrompt.length > 0)) {
            console.log("tu")
            const newMessagePrompt = {
                content: messagePrompt,
                role: "user" as const,
                id: v4(),
            }

            const newMessageFeed = [...messageFeed, newMessagePrompt]
            const currentTokens = countTokensInContext(newMessageFeed, model)
            setNextUsageReport({ model: model, tokenCount: currentTokens })
        }
    }, [isLoading, messagePrompt, model])

    const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSystemPrompt(event.target.value)
    }

    const handleMessagePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessagePrompt(event.target.value)
    }

    const handleStopGenerating = (event: MouseEvent<HTMLButtonElement>) => {
        if (isLoading) {
            stop()
        }
    }

    const handleDeleteMessage = (id: string) => {
        const newAllMessages = allMessages.filter((message) => message.id != id)
        setAllMessages(newAllMessages)
        //reload()
    }

    const submitPrompt = async (event: MouseEvent<HTMLButtonElement>) => {
        if (messagePrompt == null) {
            return
        }

        const newMessagePrompt = {
            content: messagePrompt,
            role: "user" as const,
            id: v4(),
        }

        const newAllMessages = allMessages.filter((message) => message.role != "system")
        setAllMessages([...newAllMessages, newMessagePrompt])

        const newSystemPrompt = {
            content: systemPrompt,
            role: "system" as const,
            id: v4(),
        }

        append(newSystemPrompt)

        setMessagePrompt("")
    }

    return (
        <div className="w-full max-h-[80vh] flex-1 flex flex-row gap-8">
            <div className="hidden md:block  self-stretch w-1/4">
                <textarea
                    className="bg-grey/30 py-2.5 px-4 h-full w-full resize-none rounded-md border border-white/30 outline-none focus:border-primary-blue "
                    placeholder="Describe the system..."
                    value={systemPrompt}
                    onChange={handleSystemPromptChange}
                />
            </div>
            <div className="relative overflow-auto w-full md:w-3/4 self-stretch rounded-md border border-white/30 flex flex-col justify-between">
                <div>
                    <MessageList
                        messages={messageFeed}
                        isLoading={isLoading}
                        handleDeleteMessage={handleDeleteMessage}
                    />
                </div>
                <form className="bg-black sticky flex flex-col gap-6 bottom-0 p-2.5 border-white/30">
                    {isLoading && (
                        <div className="flex items-center justify-center pt-2">
                            <CustomButton
                                text="Stop generating..."
                                type="button"
                                containerStyles="bg-white text-black rounded-full self-stretch"
                                handleClick={handleStopGenerating}
                            />
                        </div>
                    )}
                    <div className="flex flex-row items-center gap-6">
                        <textarea
                            className="bg-grey/30 py-2.5 px-4 w-full resize-none rounded-md border border-white/30 outline-none focus:border-primary-blue "
                            placeholder="Type your message..."
                            value={messagePrompt}
                            onChange={handleMessagePromptChange}
                        />
                    </div>
                    <CustomButton
                        text="Generate"
                        type="submit"
                        containerStyles="w-full bg-primary-blue rounded-full text-white disabled:bg-primary-blue/30 disabled:text-grey/50"
                        handleClick={submitPrompt}
                        disabled={isLoading}
                    />

                    <div className="text-right pr-2">
                        <UsageCounter nextRequest={nextUsageReport} />
                    </div>
                </form>
            </div>
        </div>
    )
}
