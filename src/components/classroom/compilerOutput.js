export const formatCompilerOutput = (runResult) => {
  if (!runResult) return 'Execution failed with an error.';

  if (runResult.status === 'error') {
    return runResult.error || runResult.stderr || 'Execution failed with an error.';
  }

  if (runResult.status === 'compile_error') {
    return runResult.compileOutput || runResult.stderr || 'Compilation failed.';
  }

  if (runResult.success === false) {
    return runResult.stderr || runResult.compileOutput || 'Execution failed with an error.';
  }

  if (runResult.stdout || runResult.stderr || runResult.compileOutput) {
    return runResult.stdout || runResult.stderr || runResult.compileOutput || 'Code executed successfully with no output.';
  }

  return 'Code executed successfully with no output.';
};
