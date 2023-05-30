import { exec as cpExec } from 'child_process';
import { dirname, join as joinPath } from 'path';
import { fileURLToPath } from 'url';

import { test } from 'tap';

const selfPath = dirname(fileURLToPath(import.meta.url));

const cssFile = joinPath(selfPath, '/cases/gradient.css');
const pathToCli = ` node ${joinPath(selfPath, '../bin/cli.js')}`;
const catCss = ` cat ${cssFile} | tee /dev/tty `;

const expectedCssGradients = [
  '<streaming css input>:8:1: CSS Gradients not supported by: IE (8,9) (css-gradients)\n',
  '<streaming css input>:12:1: CSS Gradients not supported by: IE (8,9) (css-gradients)\n',
];

const expectedCssRepeatingGradients = [
  '<streaming css input>:16:1: CSS Repeating Gradients not supported by: IE (8,9) (css-repeating-gradients)\n',
  '<streaming css input>:20:1: CSS Repeating Gradients not supported by: IE (8,9) (css-repeating-gradients)\n',
];
const expected = [
  ...expectedCssGradients,
  ...expectedCssRepeatingGradients,
].join('');

const commands = {
  cat: catCss,
  doiuse: `${pathToCli} --browsers="IE >= 8" `,
};

const expectedWithIgnore = expectedCssRepeatingGradients.join('');
const commandsWithIgnore = {
  cat: catCss,
  doiuse: `${pathToCli} --browsers="IE >= 8" --ignore="css-gradients" `,
};

test('cli command: piped input', (t) => {
  cpExec(`${commands.cat} | ${commands.doiuse}`, (error, stdout) => {
    t.equal(stdout, expected);
    t.notOk(error);
    t.end();
  });
});

test('should take filename as input', (t) => {
  cpExec(commands.doiuse + cssFile, (error, stdout) => {
    t.equal(stdout, expected.replace(/<streaming css input>/g, cssFile));
    t.notOk(error);
    t.end();
  });
});

test('cli command with ignore: piped input', (t) => {
  cpExec(`${commandsWithIgnore.cat} | ${commandsWithIgnore.doiuse}`, (error, stdout) => {
    t.equal(stdout, expectedWithIgnore);
    t.notOk(error);
    t.end();
  });
});

test('should take filename as input with ignore', (t) => {
  cpExec(commandsWithIgnore.doiuse + cssFile, (error, stdout) => {
    t.equal(stdout, expectedWithIgnore.replace(/<streaming css input>/g, cssFile));
    t.notOk(error);
    t.end();
  });
});

test('--json option should work', (t) => {
  cpExec(`${commands.doiuse}--json ${cssFile}`, (error, stdout) => {
    const result = stdout.toString().trim()
      .split(/\r?\n/)
      .map((value) => JSON.parse(value).feature);
    t.same(result, [
      'css-gradients',
      'css-gradients',
      'css-repeating-gradients',
      'css-repeating-gradients']);
    t.notOk(error);
    t.end();
  });
});

test('--list-only should work', (t) => {
  cpExec(`${commands.doiuse}--list-only`, (error, stdout) => {
    t.equal(stdout.toString().trim(), '[doiuse] Browsers: IE 11, IE 10, IE 9, IE 8');
    t.notOk(error);
    t.end();
  });
});

test('-c config file should work as input parameters', (t) => {
  const configFile = joinPath(selfPath, './fixtures/doiuse.config.json');
  const overflowWrapCssFile = joinPath(selfPath, './cases/overflow-wrap.css');
  const expectedOverflowWrapConfig = '<streaming css input>:7:1: CSS3 Overflow-wrap only partially supported by: IE (11) (wordwrap)\n';

  cpExec(`${commands.doiuse}-c ${configFile} ${overflowWrapCssFile}`, (error, stdout) => {
    t.equal(stdout, expectedOverflowWrapConfig.replace(/<streaming css input>/g, overflowWrapCssFile));
    t.notOk(error);
    t.end();
  });
});
