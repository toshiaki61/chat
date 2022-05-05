import { generateWorkerCaller } from '../worker.generator';

import { impl } from './loop.impl';
import Worker from './loop.worker';

export const loop = generateWorkerCaller(new Worker(), impl);
