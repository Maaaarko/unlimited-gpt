"use client"
import { CustomButtonProps } from "@/types"
import Link from "next/link"

export default function CustomButton({
    text,
    containerStyles,
    handleClick,
    linkTo,
}: CustomButtonProps) {
    return (
        <button
            disabled={false}
            type={"button"}
            className={`custom-btn ${containerStyles}}`}
            onClick={handleClick}
        >
            {linkTo && <Link href={linkTo} />}
            <span className={`flex-1`}>{text}</span>
        </button>
    )
}
