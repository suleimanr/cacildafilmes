import type React from "react"
import Image from "next/image"

const Header: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="relative w-full" style={{ height: "30vh", marginTop: "-30px" }}>
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo_punch-br6L57z3kkG1EyFPqThgMPKQnfQAfx.svg"
          alt="Punch Logo"
          layout="fill"
          objectFit="contain"
          objectPosition="top"
          priority
          className="scale-150 -translate-y-1/6"
        />
      </div>
    </div>
  )
}

export default Header

