import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY || '0'.repeat(64), 'hex')

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
  const salt = process.env.ENCRYPTION_KEY || 'vaultcheck-salt'
  return crypto.createHmac('sha256', salt).update(value).digest('hex').substring(0, 16)
}
