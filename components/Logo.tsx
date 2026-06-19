import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  variant?: "header" | "footer";
};

export function Logo({ variant = "header" }: LogoProps) {
  const width = variant === "header" ? 220 : 260;
  const height = variant === "header" ? 52 : 62;

  return (
    <Link
      aria-label="AI Invention home"
      className={`brand brand-${variant}`}
      href="/"
    >
      <span className="brand-logo-static">
        <Image
          alt="AI Invention"
          className="brand-logo-image"
          height={height}
          priority={variant === "header"}
          src="/images/ai-invention-logo.png"
          style={{ width, height: "auto", objectFit: "contain" }}
          unoptimized
          width={width}
        />
      </span>
    </Link>
  );
}
