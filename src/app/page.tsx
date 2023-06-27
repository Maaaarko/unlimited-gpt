"use client"
import { useState } from "react"
import ChatBox from "./components/ChatBox"
import ModelPicker from "./components/ModelPicker"
import { ModelName, ModelPickerProps } from "@/types"

export default function Home() {
    const [model, setModel] = useState<ModelName>("gpt-3.5-turbo")

    return (
        <main className="flex flex-col min-h-screen items-center justify-evenly gap-4 pt-24 px-4 md:px-20 pb-4 md:pb-20">
            <ModelPicker selectedModel={model} setSelectedModel={setModel} />
            <ChatBox model={model} />
        </main>
    )
}
