type AdFormat = 'horizontal' | 'rectangle' | 'article';

interface AdBannerProps {
  slot: string;
  format: AdFormat;
  className?: string;
}

const formatStyles: Record<AdFormat, string> = {
  horizontal: 'w-full h-[90px] max-w-full',
  rectangle: 'w-[300px] h-[250px]',
  article: 'max-w-xl w-full h-[120px]',
};

export default function AdBanner({ slot, format, className = '' }: AdBannerProps) {
  return (
    <div
      className={`ad-banner ad-banner--${format} flex flex-col items-center justify-center ${formatStyles[format]} ${className}`}
    >
      <span className="ad-banner__label text-xs text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wide">
        Advertisement
      </span>
      <div
        data-ad-slot={slot}
        className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-800/50 w-full h-full flex items-center justify-center"
      />
    </div>
  );
}
