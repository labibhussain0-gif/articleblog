import { Link } from 'react-router-dom';
import { urlFor } from '../lib/sanity';

export const portableTextComponents = {
  block: {
    h1: ({children}: any) => <h1 className="text-4xl font-bold mt-8 mb-4">{children}</h1>,
    h2: ({children}: any) => <h2 className="text-2xl font-bold mt-10 mb-4 pt-6 border-t border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">{children}</h2>,
    h3: ({children}: any) => <h3 className="text-2xl font-bold mt-6 mb-3">{children}</h3>,
    h4: ({children}: any) => <h4 className="text-xl font-bold mt-6 mb-3">{children}</h4>,
    normal: ({children}: any) => <p className="text-slate-700 dark:text-slate-300 text-[1.05rem] leading-[1.875] mb-6">{children}</p>,
    blockquote: ({children}: any) => <blockquote className="border-l-4 border-red-600 pl-6 py-2 my-6 italic text-slate-700 dark:text-slate-300">{children}</blockquote>,
  },
  types: {
    image: ({ value }: any) => {
      const src = (value?.asset || value?._ref) ? urlFor(value).url() : null;
      if (!src) return null;
      return (
        <figure className="my-8">
          <img
            src={src}
            alt={value?.alt || ''}
            className="w-full rounded-xl object-cover"
          />
          {value?.caption && (
            <figcaption className="mt-2 text-sm text-center text-slate-500 dark:text-slate-400 italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
  marks: {
    link: ({value, children}: any) => {
      const href = value?.href || '#';
      const isInternal = href.startsWith('/') && !href.startsWith('//');
      if (isInternal) {
        return <Link to={href} className="text-red-600 dark:text-red-400 hover:underline font-medium">{children}</Link>;
      }
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-red-600 dark:text-red-400 hover:underline font-medium">
          {children}
        </a>
      );
    },
    strong: ({children}: any) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
    em: ({children}: any) => <em className="italic">{children}</em>,
  },
  list: {
    bullet: ({children}: any) => <ul className="list-disc list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>,
    number: ({children}: any) => <ol className="list-decimal list-outside ml-6 my-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>,
  },
};
