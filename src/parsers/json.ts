import { parseWithPointers } from '@stoplight/json';
import createParser from './generic';

export default createParser(parseWithPointers, 100, ['.json']);
