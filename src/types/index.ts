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
    content: string
    role: "user" | "assistant" | "system"
    isLoading?: boolean
}

export interface MessageListProps {
    messages: MessageProps[]
    isLoading: boolean
}

export type SelectedModelProps = "gpt-3.5-turbo" | "gpt-4"

export interface ModelPickerProps {
    selectedModel: SelectedModelProps
    setSelectedModel: (model: "gpt-3.5-turbo" | "gpt-4") => void
}
