import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { rateLimit } from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL ERROR: JWT_SECRET environment variable is not defined.');
}

const parseSafeInt = (value: any, defaultValue: number): number => {
  const parsed = parseInt(value as string, 10);
  if (isNaN(parsed) || parsed < 1) return defaultValue;
  return parsed;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { error: 'Too many requests from this IP, please try again after 15 minutes' }
  });

  // Auth Routes
  app.post('/api/v1/auth/register', authLimiter, async (req, res) => {
    try {
      const { email, username, password, name } = req.body;

      if (typeof email !== 'string' || typeof username !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }

      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] }
      });
      if (existingUser) return res.status(409).json({ error: 'User already exists' });

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, username, passwordHash, name }
      });

      const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword, accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/v1/auth/login', authLimiter, async (req, res) => {
    try {
      const { email, password } = req.body;

      if (typeof email !== 'string' || typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input parameters' });
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const validPassword = await bcrypt.compare(password, user.passwordHash);
      if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

      const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, accessToken, refreshToken });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/v1/auth/me', authenticateToken, async (req: any, res) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) return res.status(404).json({ error: 'User not found' });
      const { passwordHash: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Articles Routes
  app.get('/api/v1/articles', async (req, res) => {
    try {
      const { category, page = '1', limit = '10' } = req.query;
      const pageNum = parseSafeInt(page, 1);
      const limitNum = Math.min(parseSafeInt(limit, 10), 100);
      const skip = (pageNum - 1) * limitNum;

      const where: any = { status: 'PUBLISHED' };
      if (category) {
        where.category = { slug: category as string };
      }

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where,
          include: {
            author: { select: { username: true, name: true, avatarUrl: true } },
            category: true,
            tags: { include: { tag: true } }
          },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.article.count({ where })
      ]);

      res.json({
        articles,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/v1/articles/:slug', async (req, res) => {
    try {
      const article = await prisma.article.findUnique({
        where: { slug: req.params.slug },
        include: {
          author: { select: { id: true, username: true, name: true, avatarUrl: true, bio: true } },
          category: true,
          tags: { include: { tag: true } },
          comments: { include: { author: { select: { username: true, name: true, avatarUrl: true } } } }
        }
      });
      if (!article) return res.status(404).json({ error: 'Article not found' });
      res.json(article);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/v1/articles', authenticateToken, async (req: any, res) => {
    try {
      const { title, excerpt, content, coverImage, status, categoryId } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const article = await prisma.article.create({
        data: {
          title, slug, excerpt, content, coverImage, status, categoryId,
          authorId: req.user.id,
          publishedAt: status === 'PUBLISHED' ? new Date() : null
        }
      });
      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Comments
  app.post('/api/v1/articles/:slug/comments', authenticateToken, async (req: any, res) => {
    try {
      const { content, parentId } = req.body;

      const comment = await prisma.comment.create({
        data: {
          content,
          author: { connect: { id: req.user.id } },
          ...(parentId && { parent: { connect: { id: parentId } } }),
          article: { connect: { slug: req.params.slug } }
        },
        include: { author: { select: { username: true, name: true, avatarUrl: true } } }
      });
      res.status(201).json(comment);
    } catch (error: any) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Article not found' });
      }
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Categories Routes
  app.get('/api/v1/categories', async (req, res) => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: 'asc' }
      });
      res.json({ categories });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/v1/categories/:slug', async (req, res) => {
    try {
      const { page = '1', limit = '10' } = req.query;
      const pageNum = parseSafeInt(page, 1);
      const limitNum = Math.min(parseSafeInt(limit, 10), 100);
      const skip = (pageNum - 1) * limitNum;

      const category = await prisma.category.findUnique({
        where: { slug: req.params.slug }
      });
      if (!category) return res.status(404).json({ error: 'Category not found' });

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: { categoryId: category.id, status: 'PUBLISHED' },
          include: {
            author: { select: { username: true, name: true, avatarUrl: true } },
            category: true,
            tags: { include: { tag: true } }
          },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.article.count({ where: { categoryId: category.id, status: 'PUBLISHED' } })
      ]);

      res.json({
        category,
        articles,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Authors Routes
  app.get('/api/v1/authors/:slug', async (req, res) => {
    try {
      const author = await prisma.user.findUnique({
        where: { username: req.params.slug },
        select: { id: true, username: true, name: true, bio: true, avatarUrl: true, socialLinks: true, createdAt: true }
      });
      if (!author) return res.status(404).json({ error: 'Author not found' });

      const articles = await prisma.article.findMany({
        where: { authorId: author.id, status: 'PUBLISHED' },
        include: {
          author: { select: { username: true, name: true, avatarUrl: true } },
          category: true,
          tags: { include: { tag: true } }
        },
        orderBy: { publishedAt: 'desc' }
      });

      res.json({ author, articles });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Search Routes
  app.get('/api/v1/search', async (req, res) => {
    try {
      const { q, page = '1', limit = '10' } = req.query;
      if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

      const pageNum = parseSafeInt(page, 1);
      const limitNum = Math.min(parseSafeInt(limit, 10), 100);
      const skip = (pageNum - 1) * limitNum;

      const [articles, total] = await Promise.all([
        prisma.article.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: q as string } },
              { content: { contains: q as string } },
              { excerpt: { contains: q as string } }
            ]
          },
          include: {
            author: { select: { username: true, name: true, avatarUrl: true } },
            category: true,
            tags: { include: { tag: true } }
          },
          orderBy: { publishedAt: 'desc' },
          skip,
          take: limitNum
        }),
        prisma.article.count({
          where: {
            status: 'PUBLISHED',
            OR: [
              { title: { contains: q as string } },
              { content: { contains: q as string } },
              { excerpt: { contains: q as string } }
            ]
          }
        })
      ]);

      res.json({
        articles,
        pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) }
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Serve the Sanity Studio sub-app at /studio
  const studioDistPath = path.join(process.cwd(), 'studio/dist');
  app.use('/studio', express.static(studioDistPath));
  app.get('/studio/*', (req, res) => {
    res.sendFile(path.join(studioDistPath, 'index.html'));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Server running on http://localhost:${PORT}`);
    }
  });
}

startServer();
