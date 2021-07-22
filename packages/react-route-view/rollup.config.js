import buble from '@rollup/plugin-buble';
import empty from 'rollup-plugin-empty';
import copy from 'rollup-plugin-copy';
import match from 'rollup-plugin-match';
import combine from 'rollup-plugin-combine';
import replaceImports from 'rollup-plugin-replace-imports';

export default {
  input: 'src/**/*.js',
  plugins: [
    empty({
      silent: false,
      dir: 'dist'
    }),
    match(),
    combine({
      outputDir: true,
      camelCase: false
    }),
    copy({
      targets: [
        { src: 'package.json', dest: 'dist' },
        { src: 'README.md', dest: 'dist' },
        { src: 'types/index.d.ts', dest: 'dist' }
      ]
    }),
    buble()
  ],
  output: [
    {
      dir: 'dist/es',
      format: 'es',
      exports: 'auto'
    },
    {
      dir: 'dist',
      format: 'cjs',
      exports: 'auto',
      plugins: [
        replaceImports((n) => n.replace('/es/', '/'))
      ]
    }
  ]
};
