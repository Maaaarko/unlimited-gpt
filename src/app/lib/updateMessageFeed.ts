import { MessageFeedItem, ModelName } from "@/types"
import { Message } from "ai"

export default function updateMessageFeed(
    allMessages: Message[],
    currentMessageFeed: MessageFeedItem[],
    currentModel: ModelName
): MessageFeedItem[] {
    const newMessageFeed: MessageFeedItem[] = allMessages
        .filter((message) => message.role != "system")
        .map((message) => {
            switch (message.role) {
                case "user":
                    return {
                        id: message.id,
                        content: message.content,
                        role: message.role,
                        userName: "User",
                        userIconUrl: "/user-avatar.svg",
                    }
                case "assistant":
                    return {
                        id: message.id,
                        content: message.content,
                        role: message.role,
                        userName: currentModel,
                        userIconUrl: "/openai-logo.svg",
                    }
                default:
                    return message
            }
        })

    const updatedMessageFeed = newMessageFeed.map((message) => {
        const correspondingMessage = currentMessageFeed.find((messageFeedItem) => messageFeedItem.id == message.id)
        if (correspondingMessage == null) {
            return message
        } else {
            return {
                ...message,
                userName: correspondingMessage.userName,
                userIconUrl: correspondingMessage.userIconUrl,
            }
        }
    })

    return updatedMessageFeed
}
