const { existsSync, readFileSync } = require('node:fs')
const { join } = require('node:path')
const { parseEnv } = require('node:util')

// Переменные из .env передаём процессу явно: так их видит и сервер,
// и `pm2 reload --update-env` после правки .env
const envFile = join(__dirname, '.env')
const fileEnv = existsSync(envFile) ? parseEnv(readFileSync(envFile, 'utf8')) : {}

module.exports = {
  apps: [{
    name: 'video-surveillance',
    cwd: __dirname,
    script: 'dist/server/entry.mjs',
    // Лендинг почти целиком статический — одного процесса достаточно
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOST: '0.0.0.0',
      ...fileEnv
    },
    error_file: join(__dirname, 'logs/err.log'),
    out_file: join(__dirname, 'logs/out.log'),
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '300M'
  }]
}
