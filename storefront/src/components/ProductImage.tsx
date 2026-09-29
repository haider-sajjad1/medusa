type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
};

// A plain <img> keeps images working from any host (S3, or the backend's own
// /static uploads on localhost) without extra next/image configuration.
export default function ProductImage({ src, alt, className = "" }: Props) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-neutral-100 text-sm text-neutral-400 ${className}`}
      >
        No image
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={`bg-neutral-100 object-cover ${className}`}
    />
  );
}
