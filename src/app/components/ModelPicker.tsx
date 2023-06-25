import { ModelPickerProps } from "@/types"

export default function ModelPicker({
    selectedModel,
    setSelectedModel,
}: ModelPickerProps) {
    const selectedStyles = "bg-white text-black font-bold"

    const availableModels = [
        { name: "gpt-3.5-turbo" as const, displayName: "GPT-3.5" },
        { name: "gpt-4" as const, displayName: "GPT-4" },
    ]

    return (
        <div className="bg-grey/30 p-1.5 rounded-full flex flex-row justify-between gap-4">
            {availableModels.map((model) => (
                <div
                    key={model.name}
                    className={`cursor-pointer p-4 basis-0 rounded-full ${
                        model.name == selectedModel && selectedStyles
                    }`}
                    onClick={() => setSelectedModel(model.name)}
                >
                    {model.displayName}
                </div>
            ))}
        </div>
    )
}
