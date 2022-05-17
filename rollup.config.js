import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import external from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';

const packageJson = require('./package.json');

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: packageJson.main,
                format: 'cjs',
                sourcemap: true,
                name: 'daas-print-lib'
            },
            {
                file: packageJson.module,
                format: 'esm',
                sourcemap: true
            }
        ],
        plugins: [
            external(),
            resolve(),
            commonjs(),
            // babel({
            //     exclude: 'node_modules/**',
            //     presets: ["@babel/preset-react"],
            //     babelHelpers: "bundled",
            //     // runtimeHelpers: true,
            // }),
            typescript({ tsconfig: './tsconfig.json' }),
            terser(),
            // replace({
            //     include: 'node_modules/formidable/lib/*.js',
            //     values: {
            //         'if \\(global\\.GENTLY\\) require = GENTLY\\.hijack\\(require\\);': '',
            //     }
            // }),
            postcss({
                plugins: [autoprefixer()],
                modules: {
                    scopeBehaviour: 'global',
                },
                sourceMap: true,
                extract: true,
            })
        ],
    },
    {
        input: 'dist/esm/types/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: "esm" }],
        external: [/\.css$/],
        plugins: [dts()],
    },
]
