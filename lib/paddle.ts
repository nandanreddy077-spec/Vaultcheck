import { Environment, Paddle } from '@paddle/paddle-node-sdk'

export function getPaddle(): Paddle {
  const apiKey = process.env.PADDLE_API_KEY
  if (!apiKey) {
    throw new Error('Missing PADDLE_API_KEY')
  }
  const environment =
    process.env.PADDLE_ENVIRONMENT === 'production' ? Environment.production : Environment.sandbox
  return new Paddle(apiKey, { environment })
}
