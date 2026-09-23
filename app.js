const { spawn } = require('child_process');
const path = require('path');

// cPanel/Passenger pasa el puerto dinámico en process.env.PORT
const port = process.env.PORT || 3000;
process.env.PORT = port;

console.log(`Iniciando servidor de Vinext en el puerto ${port}...`);

// Lanzamos el comando de producción 'npx vinext start'
const child = spawn('npx', ['vinext', 'start'], {
  env: process.env,
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

child.on('close', (code) => {
  console.log(`El servidor de Vinext se detuvo con el código: ${code}`);
});
