import { spawn } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const useShell = process.platform === 'win32';

const processes = [
  spawn(npmCommand, ['run', 'dev', '--prefix', 'backend'], {
    stdio: 'inherit',
    shell: useShell
  }),
  spawn(npmCommand, ['run', 'dev', '--prefix', 'frontend'], {
    stdio: 'inherit',
    shell: useShell
  })
];

const stopAll = () => {
  processes.forEach((processRef) => {
    if (!processRef.killed) processRef.kill();
  });
};

process.on('SIGINT', () => {
  stopAll();
  process.exit(0);
});

process.on('SIGTERM', () => {
  stopAll();
  process.exit(0);
});

processes.forEach((processRef) => {
  processRef.on('exit', (code) => {
    if (code && code !== 0) {
      stopAll();
      process.exit(code);
    }
  });
});
