import Link from "next/link"
import Image from "next/image"
import CustomButton from "./CustomButton"

export default function Navbar() {
    return (
        <header className="w-full absolute z-10">
            <nav className="bg-white w-full mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
                <Link href="/" className="flex justify-center items-center gap-2">
                    <Image src="/logo.png" alt="UnlimitedGPT logo" width={32} height={32} className="object-contain" />
                    <span className="text-black font-bold text-xl">Unlimited GPT</span>
                </Link>
                <CustomButton
                    type="button"
                    text="Sign in"
                    containerStyles="bg-primary-blue text-white rounded-full"
                    linkTo="/signin"
                />
            </nav>
        </header>
    )
}
