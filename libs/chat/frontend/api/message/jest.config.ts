module.exports = {
  displayName: 'chat-frontend-api-message',
  preset: '../../../../../jest.preset.ts',
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      { jsc: { transform: { react: { runtime: 'automatic' } } } },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../../coverage/libs/chat/frontend/api/message',
};
