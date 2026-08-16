import Link from "next/link";

type BrandProps = {
  href?: string;
  onClick?: () => void;
};

export function Brand({ href = "/", onClick }: BrandProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="brand-lockup"
      aria-label="Molecular Frame home"
    >
      <span className="brand-mark" aria-hidden="true">
        <span />
        <span />
      </span>
      <span className="brand-name">Molecular Frame</span>
    </Link>
  );
}
