import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemas } from './schemas';

export default defineConfig({
  name: 'the-daily-pulse',
  title: 'The Daily Pulse',
  projectId: 'r9p19ugf',
  dataset: 'production',
  basePath: '/studio',
  plugins: [
    structureTool(),
    visionTool(),
  ],
  schema: {
    types: schemas,
  },
});
