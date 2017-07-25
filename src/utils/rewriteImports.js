import path from 'path';

import logger from './logger';

const importRegexp = /@import\s+(?:'([^'~][^']*)'|"([^"~][^"]*)"|([^\s;~][^\s;]*))\s*(?:;|$)/g;

export default (error, file, contents, moduleContext, callback) => {
  if (error) {
    logger.debug('Resources: **not found**');
    return callback(error);
  }

  if (!/\.s[ac]ss$/i.test(file)) {
    return callback(null, contents);
  }

  const rewritten = contents.replace(importRegexp, (entire, single, double, unquoted) => {
    const oldImportPath = single || double || unquoted;
    const absoluteImportPath = path.join(path.dirname(file), oldImportPath);
    const newImportPath = path.relative(moduleContext, absoluteImportPath);

    logger.debug(`Resources: @import of ${oldImportPath} changed to ${newImportPath}`);

	console.log();
	console.log(entire);
    console.log(`Resources: context is ${moduleContext}`);
    console.log(`Resources: @import of ${oldImportPath} changed to ${newImportPath}`);

    const lastCharacter = entire[entire.length - 1];
    const quote = lastCharacter === "'" || lastCharacter === '"' ? lastCharacter : '';

    return `@import ${quote}${newImportPath}${quote}`;
  });

  callback(null, rewritten);
};
