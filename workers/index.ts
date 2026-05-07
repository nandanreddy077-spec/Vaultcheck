// Combined worker entry point — runs QBO and Xero workers in one process.
// Deploy with: npm run worker
// Railway: set start command to `npm run worker`, build command to `npm run worker:build`
import './qbo-worker.tsx'
import './xero-worker.ts'

console.log('Vantirs workers started (QBO + Xero)')
