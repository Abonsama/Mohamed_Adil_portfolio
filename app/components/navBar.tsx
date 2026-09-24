import Link from "next/link";
export default function NavBar(){
    return(
        <nav className="flex gap-12 h-full">
            <Link href={"/"} className="animate-[fade-in-down_0.8s_ease-out]">Home</Link>
            <Link href={"/skills"} className="animate-[fade-in-down_0.8s_ease-out]">Skills</Link>
            <Link href={"/projects"} className="animate-[fade-in-down_0.8s_ease-out]">Projects</Link>
        </nav>
    )
}