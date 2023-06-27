import { ModelPickerProps } from "@/types"
import Image from "next/image"

const availableModels = [
    { name: "gpt-3.5-turbo" as const, displayName: "GPT-3.5", extra: "4K" },
    { name: "gpt-3.5-turbo-16k" as const, displayName: "GPT-3.5", extra: "16K" },
    // { name: "gpt-4" as const, displayName: "GPT-4", extra: "8K" },
    // { name: "gpt-4-32k" as const, displayName: "GPT-4", extra: "32K" },
]

export default function ModelPicker({ selectedModel, setSelectedModel }: ModelPickerProps) {
    const selectedStyles = "bg-white text-black font-bold"
    return (
        <div className="w-full bg-grey/30 p-1.5 rounded-full flex flex-row justify-between gap-2 md:gap-4">
            {availableModels.map((model) => (
                <div
                    key={model.name}
                    className={`cursor-pointer p-2 basis-0 rounded-full font-semibold grow flex flex-col justify-center items-center ${
                        model.name == selectedModel && selectedStyles
                    }`}
                    onClick={() => setSelectedModel(model.name)}
                >
                    {model.displayName}
                    <span>{model.extra}</span>
                </div>
            ))}
        </div>
    )
}
