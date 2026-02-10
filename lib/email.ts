import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is not defined. Email sending will be mocked.')
}

export const resend = process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null
