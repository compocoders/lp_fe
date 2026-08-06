import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCompilerOutput } from './compilerOutput.js';

test('returns stdout when code executes successfully and produces output', () => {
  const result = formatCompilerOutput({
    success: true,
    stdout: '42\n',
    stderr: '',
    compileOutput: '',
    status: 'accepted',
  });

  assert.equal(result, '42\n');
});

test('returns compile output for compilation errors', () => {
  const result = formatCompilerOutput({
    success: false,
    stdout: '',
    stderr: '',
    compileOutput: 'SyntaxError: unexpected token',
    status: 'compile_error',
  });

  assert.equal(result, 'SyntaxError: unexpected token');
});

test('returns a fallback message only when there is truly no output or error', () => {
  const result = formatCompilerOutput({
    success: true,
    stdout: '',
    stderr: '',
    compileOutput: '',
    status: 'accepted',
  });

  assert.equal(result, 'Code executed successfully with no output.');
});
