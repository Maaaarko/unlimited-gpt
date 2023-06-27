import { Message } from "ai"
import { MouseEventHandler } from "react"

export interface ChatBoxProps {
    model: "gpt-3.5-turbo" | "gpt-4"
}

export interface CustomButtonProps {
    text: string
    type: "button" | "submit"
    containerStyles?: string
    handleClick?: MouseEventHandler<HTMLButtonElement>
    linkTo?: string
    disabled?: boolean
}

export interface MessageProps {
    id: string
    content: string
    role: "user" | "assistant" | "system"
    userName?: string
    userIconUrl?: string | "/logo.png"
    isLoading?: boolean
    deleteMessage?: () => void
}

export interface MessageListProps {
    messages: MessageProps[]
    isLoading: boolean
    handleDeleteMessage: (id: string) => void
}

export interface MessageFeedItem {
    id: string
    content: string
    role: "user" | "assistant" | "system"
    userName?: string
    userIconUrl?: string
}

export type ModelName = "gpt-3.5-turbo" | "gpt-4"

export interface ModelPickerProps {
    selectedModel: ModelName
    setSelectedModel: (model: "gpt-3.5-turbo" | "gpt-3.5-turbo-16k" | "gpt-4" | "gpt-4-32k") => void
}

export interface UsageReport {
    model: ModelName
    tokenCount: number
}

export interface UsageTrackerProps {
    nextRequest: UsageReport
}
