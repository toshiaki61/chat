/* eslint-disable no-restricted-globals */
import { generateWorkerListener } from '../worker.generator';

import { impl } from './loop.impl';

import type { CustomWorker } from '../worker.interface';

const ctx: CustomWorker = self as never;
export default ctx;

ctx.addEventListener('message', generateWorkerListener(ctx, impl));
