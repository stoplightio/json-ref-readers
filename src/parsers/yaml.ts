import { parseWithPointers } from '@stoplight/yaml';
import createParser from './generic';

export default createParser(parseWithPointers, 200, ['.yaml', '.yml', '.json']);
