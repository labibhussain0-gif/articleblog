import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const articleSchema = z.object({
  title: z.string().min(5),
  excerpt: z.string().optional(),
  content: z.string().min(20),
  status: z.enum(['DRAFT', 'PUBLISHED']),
});

type ArticleForm = z.infer<typeof articleSchema>;

export default function CreateArticle() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ArticleForm>({
    resolver: zodResolver(articleSchema),
    defaultValues: { status: 'PUBLISHED' }
  });

  const onSubmit = async (data: ArticleForm) => {
    try {
      const res = await api.post('/articles', data);
      navigate(`/article/${res.data.slug}`);
    } catch (error) {
      alert('Failed to create article');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 dark:text-white">Write a new article</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
          <input
            id="title"
            {...register('title')}
            disabled={isSubmitting}
            aria-invalid={errors.title ? "true" : "false"}
            aria-describedby={errors.title ? "title-error" : undefined}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3 disabled:opacity-50"
            placeholder="Title"
          />
          {errors.title && <p id="title-error" role="alert" className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Excerpt (Optional)</label>
          <textarea
            id="excerpt"
            {...register('excerpt')}
            disabled={isSubmitting}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3 disabled:opacity-50"
            placeholder="A short summary of your article..."
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
          <textarea
            id="content"
            {...register('content')}
            disabled={isSubmitting}
            aria-invalid={errors.content ? "true" : "false"}
            aria-describedby={errors.content ? "content-error" : undefined}
            rows={15}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white p-3 font-mono disabled:opacity-50"
            placeholder="Write your article content here (Markdown supported)..."
          />
          {errors.content && <p id="content-error" role="alert" className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="flex items-center gap-4">
          <select
            {...register('status')}
            disabled={isSubmitting}
            aria-label="Article Status"
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white p-2 disabled:opacity-50"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </form>
    </div>
  );
}
