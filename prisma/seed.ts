import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const authorPasswordHash = await bcrypt.hash('author123', 10);
  const author = await prisma.user.upsert({
    where: { email: 'sarah.chen@example.com' },
    update: {},
    create: {
      email: 'sarah.chen@example.com',
      username: 'sarahchen',
      passwordHash: authorPasswordHash,
      name: 'Sarah Chen',
      bio: 'Senior political analyst covering Washington D.C. and global policy. Former NYT columnist.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      role: 'AUTHOR',
    },
  });

  const categories = [
    { name: 'Politics', slug: 'politics', description: 'Political news and analysis', color: '#dc2626' },
    { name: 'Economy', slug: 'economy', description: 'Economic trends and market analysis', color: '#059669' },
    { name: 'Culture', slug: 'culture', description: 'Arts, entertainment, and society', color: '#7c3aed' },
    { name: 'Tech', slug: 'tech', description: 'Technology and innovation', color: '#2563eb' },
    { name: 'Sports', slug: 'sports', description: 'Sports news and analysis', color: '#ea580c' },
    { name: 'Opinion', slug: 'opinion', description: 'Commentary and editorials', color: '#db2777' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
  }

  const tags = [
    { name: 'Breaking News', slug: 'breaking-news' },
    { name: 'Analysis', slug: 'analysis' },
    { name: 'Opinion', slug: 'opinion' },
    { name: 'Feature', slug: 'feature' },
    { name: 'Interview', slug: 'interview' },
    { name: 'Market Update', slug: 'market-update' },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag });
  }

  const politics = await prisma.category.findUnique({ where: { slug: 'politics' } });
  const economy = await prisma.category.findUnique({ where: { slug: 'economy' } });
  const culture = await prisma.category.findUnique({ where: { slug: 'culture' } });
  const tech = await prisma.category.findUnique({ where: { slug: 'tech' } });
  const breakingTag = await prisma.tag.findUnique({ where: { slug: 'breaking-news' } });
  const analysisTag = await prisma.tag.findUnique({ where: { slug: 'analysis' } });

  const articles = [
    {
      title: 'Senate Passes Landmark Climate Legislation',
      slug: 'senate-passes-landmark-climate-legislation',
      excerpt: 'In a historic bipartisan vote, the Senate approved sweeping climate measures aimed at reducing carbon emissions by 50% by 2030.',
      content: 'In a historic bipartisan vote, the Senate approved sweeping climate measures aimed at reducing carbon emissions by 50% by 2030. The legislation, which passed 62-38, represents the most significant climate action taken by Congress in decades.\n\nThe bill includes provisions for renewable energy tax incentives, electric vehicle credits, and funding for climate resilience infrastructure.',
      status: 'PUBLISHED',
      categoryId: politics!.id,
      coverImage: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=2070',
      tags: [breakingTag!],
    },
    {
      title: 'Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty',
      slug: 'fed-signals-potential-rate-cuts',
      excerpt: 'Fed Chair Powell indicated the central bank may begin cutting interest rates later this year as inflation shows signs of cooling.',
      content: 'Federal Reserve Chair Jerome Powell signaled Thursday that the central bank may begin cutting interest rates later this year if inflation continues its downward trajectory.\n\nSpeaking after the Fed\'s latest policy meeting, Powell noted that "significant progress" has been made in bringing inflation back toward the 2% target.',
      status: 'PUBLISHED',
      categoryId: economy!.id,
      coverImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=2070',
      tags: [analysisTag!],
    },
    {
      title: 'The Renaissance of Analog Photography in the Digital Age',
      slug: 'renaissance-analog-photography-digital-age',
      excerpt: 'Why Gen Z is embracing film cameras and darkroom printing in an era of smartphones and social media.',
      content: 'In an age when smartphones can produce near-perfect images with a tap, a growing movement of young photographers is turning back the clock to analog methods.\n\nFilm camera sales have surged 40% over the past three years, with vintage Pentax and Canon models leading the charge.',
      status: 'PUBLISHED',
      categoryId: culture!.id,
      coverImage: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894?auto=format&fit=crop&q=80&w=2070',
      tags: [],
    },
    {
      title: 'OpenAI Unveils Next-Generation Reasoning Model',
      slug: 'openai-unveils-next-generation-reasoning-model',
      excerpt: 'The new model demonstrates unprecedented capabilities in complex problem-solving and scientific research assistance.',
      content: 'OpenAI has unveiled its latest artificial intelligence model, claiming breakthrough capabilities in complex reasoning and scientific research.\n\nThe new system, which the company is calling "Aurora," achieved state-of-the-art results on a battery of benchmark tests.',
      status: 'PUBLISHED',
      categoryId: tech!.id,
      coverImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=2070',
      tags: [breakingTag!],
    },
    {
      title: 'Global Markets React to Trade Agreement Breakthrough',
      slug: 'global-markets-react-trade-agreement',
      excerpt: 'Asian and European markets surge following the announcement of a new trans-Pacific trade framework.',
      content: 'Global financial markets rallied Thursday following the announcement of a comprehensive trans-Pacific trade agreement, marking the most significant liberalization of trade rules in years.\n\nThe agreement, reached after 18 months of negotiations, reduces tariffs on a wide range of goods.',
      status: 'PUBLISHED',
      categoryId: economy!.id,
      coverImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=2070',
      tags: [analysisTag!],
    },
  ];

  for (const articleData of articles) {
    const { tags: articleTags, ...articleFields } = articleData;
    const article = await prisma.article.upsert({
      where: { slug: articleFields.slug },
      update: {},
      create: {
        ...articleFields,
        authorId: author.id,
        publishedAt: new Date(),
        readingTime: Math.ceil(articleFields.content.split(' ').length / 200),
      },
    });

    for (const tag of articleTags) {
      await prisma.articleTag.upsert({
        where: { articleId_tagId: { articleId: article.id, tagId: tag.id } },
        update: {},
        create: { articleId: article.id, tagId: tag.id },
      });
    }
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
