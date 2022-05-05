import type { ConfigFile } from '@rtk-query/codegen-openapi';

const config: ConfigFile = {
  schemaFile: './chat-openapi.json',
  apiFile: './src/store/empty-api.ts',
  apiImport: 'emptySplitApi',
  outputFile: './src/store/chat-api.ts',
  exportName: 'chatApi',
  hooks: true,
};

export default config;
