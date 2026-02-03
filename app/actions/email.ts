"use server"

import { resend } from "@/lib/email"
import { confirmationEmailTemplate, reminderEmailTemplate, verificationEmailTemplate } from "@/lib/email-templates"

interface SendConfirmationEmailParams {
    to: string
    clientName: string
    serviceName: string
    businessName: string
    startAt: Date
    endAt: Date
    address?: string
    phone?: string
}

export async function sendConfirmationEmail(params: SendConfirmationEmailParams) {
    try {
        const { to, ...emailData } = params

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'NEXO <onboarding@resend.dev>',
            to: [to],
            subject: `✅ Confirmation de rendez-vous - ${emailData.serviceName}`,
            html: confirmationEmailTemplate(emailData)
        })

        if (error) {
            console.error('Error sending confirmation email:', error)
            return { success: false, error }
        }

        console.log('Confirmation email sent:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Failed to send confirmation email:', error)
        return { success: false, error }
    }
}

interface SendReminderEmailParams {
    to: string
    clientName: string
    serviceName: string
    businessName: string
    startAt: Date
    endAt: Date
    address?: string
    phone?: string
}

export async function sendReminderEmail(params: SendReminderEmailParams) {
    try {
        const { to, ...emailData } = params

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'NEXO <onboarding@resend.dev>',
            to: [to],
            subject: `⏰ Rappel - Rendez-vous demain chez ${emailData.businessName}`,
            html: reminderEmailTemplate(emailData)
        })

        if (error) {
            console.error('Error sending reminder email:', error)
            return { success: false, error }
        }

        console.log('Reminder email sent:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Failed to send reminder email:', error)
        return { success: false, error }
    }
}

interface SendVerificationEmailParams {
    to: string
    name: string
    verificationUrl: string
}

export async function sendVerificationEmail(params: SendVerificationEmailParams) {
    try {
        const { to, name, verificationUrl } = params

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'NEXO <onboarding@resend.dev>',
            to: [to],
            subject: '✅ Activez votre compte NEXO',
            html: verificationEmailTemplate({ name, verificationUrl })
        })

        if (error) {
            console.error('Error sending verification email:', error)
            return { success: false, error }
        }

        console.log('Verification email sent:', data)
        return { success: true, data }
    } catch (error) {
        console.error('Failed to send verification email:', error)
        return { success: false, error }
    }
}
