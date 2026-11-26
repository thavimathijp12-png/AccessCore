import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = 'C:\\Users\\thavi\\.gemini\\antigravity\\brain\\82813ad6-0a80-4af8-a5d3-51c29eb9b000'

console.log('Starting preview server...')
const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
  shell: true,
  stdio: 'ignore'
})

await new Promise(r => setTimeout(r, 2500))

const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome-portal-sel-' + Date.now())
const outFile = path.resolve(outDir, 'login-selection.png')

try {
  const cmd = `"${chromePath}" --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="${tempProfile}" --window-size=1440,900 --virtual-time-budget=3000 --screenshot="${outFile}" "http://localhost:4173/login"`
  execSync(cmd, { stdio: 'pipe', timeout: 25000 })
  if (fs.existsSync(outFile)) {
    console.log(`Successfully captured login-selection: ${fs.statSync(outFile).size} bytes`)
  }
} catch (err) {
  console.error(`Error:`, err.message)
} finally {
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true })
    preview.kill()
    execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq vite*"', { stdio: 'ignore' })
  } catch (e) {}
}
