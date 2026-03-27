import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: 'r9p19ugf',
    dataset: 'production'
  },
  project: {
    basePath: '/studio'
  }
});
