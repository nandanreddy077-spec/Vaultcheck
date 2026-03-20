import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_HEX = process.env.ENCRYPTION_KEY
if (!KEY_HEX) {
  throw new Error('Missing ENCRYPTION_KEY: set a 32-byte hex string (64 hex chars) for AES-256-GCM.')
}
if (!/^[0-9a-fA-F]{64}$/.test(KEY_HEX)) {
  throw new Error('Invalid ENCRYPTION_KEY: expected a 64-char hex string (32-byte key).')
}
const KEY = Buffer.from(KEY_HEX, 'hex')

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decrypt(ciphertext: string): string {
  const [ivHex, tagHex, encryptedHex] = ciphertext.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const tag = Buffer.from(tagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(tag)
  return decipher.update(encrypted) + decipher.final('utf8')
}

export function hashBankData(value: string): string {
  if (!process.env.ENCRYPTION_KEY) {
    // Should never happen because KEY_HEX validation runs at module load time.
    throw new Error('Missing ENCRYPTION_KEY for bank hashing.')
  }
  const salt = process.env.ENCRYPTION_KEY
  return crypto.createHmac('sha256', salt).update(value).digest('hex').substring(0, 16)
}
