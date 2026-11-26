import { execSync, spawn } from 'child_process'
import fs from 'fs'
import path from 'path'

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const outDir = 'C:\\Users\\thavi\\.gemini\\antigravity\\brain\\82813ad6-0a80-4af8-a5d3-51c29eb9b000'

const routes = [
  { name: 'login-selection', url: 'http://localhost:4173/login' },
  { name: 'login-admin', url: 'http://localhost:4173/login/admin' },
  { name: 'login-lead', url: 'http://localhost:4173/login/lead' },
  { name: 'login-employee', url: 'http://localhost:4173/login/employee' },
]

console.log('Starting preview server...')
const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
  shell: true,
  stdio: 'ignore'
})

// Wait 2 seconds for server to start
await new Promise(r => setTimeout(r, 2000))

try {
  for (const r of routes) {
    const tempProfile = path.join(process.env.TEMP || 'C:\\Windows\\Temp', 'chrome-portal-' + r.name + '-' + Date.now())
    const outFile = path.resolve(outDir, `${r.name}.png`)
    console.log(`Capturing ${r.name} to ${outFile}...`)
    try {
      const cmd = `"${chromePath}" --headless=new --disable-gpu --no-first-run --no-default-browser-check --user-data-dir="${tempProfile}" --window-size=1440,900 --virtual-time-budget=4000 --screenshot="${outFile}" "${r.url}"`
      execSync(cmd, { stdio: 'pipe', timeout: 25000 })
      if (fs.existsSync(outFile)) {
        console.log(`Successfully captured ${r.name}: ${fs.statSync(outFile).size} bytes`)
      }
    } catch (err) {
      console.error(`Error capturing ${r.name}:`, err.message)
    } finally {
      try {
        fs.rmSync(tempProfile, { recursive: true, force: true })
      } catch (e) {}
    }
  }
} finally {
  try {
    preview.kill()
    execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq vite*"', { stdio: 'ignore' })
  } catch (e) {}
}

console.log('Capture script finished.')
