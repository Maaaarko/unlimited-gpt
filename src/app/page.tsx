"use client"
import { useState } from "react"
import ChatBox from "./components/ChatBox"
import ModelPicker from "./components/ModelPicker"
import { ModelPickerProps, SelectedModelProps } from "@/types"

export default function Home() {
    const [model, setModel] = useState<SelectedModelProps>("gpt-4")

    return (
        <main className="flex flex-col min-h-screen items-center justify-evenly gap-4 pt-24 px-4 md:px-20 pb-4 md:pb-20">
            <ModelPicker selectedModel={model} setSelectedModel={setModel} />
            <ChatBox model="gpt-4" />
        </main>
    )
}
