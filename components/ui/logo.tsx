interface LogoProps {
  className?: string;
  width?: number;
}

export default function Logo({ className = '', width = 180 }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="Fullescabio Almacén de Bebidas"
      width={width}
      style={{ height: 'auto' }}
      className={className}
    />
  );
}
