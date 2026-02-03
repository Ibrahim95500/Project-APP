import { format } from "date-fns"
import { fr } from "date-fns/locale"

interface AppointmentEmailData {
    clientName: string
    serviceName: string
    businessName: string
    startAt: Date
    endAt: Date
    address?: string
    phone?: string
}

export function confirmationEmailTemplate(data: AppointmentEmailData) {
    const { clientName, serviceName, businessName, startAt, endAt, address, phone } = data

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation de rendez-vous</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px;">NEXO</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Confirmation de rendez-vous</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #1e293b; margin: 0 0 24px 0; font-weight: 600;">
                Bonjour ${clientName},
            </p>

            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 32px 0;">
                Votre rendez-vous a été <strong style="color: #7C3AED;">confirmé avec succès</strong> ! Nous avons hâte de vous accueillir.
            </p>

            <!-- Appointment Details Card -->
            <div style="background-color: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 32px; border-left: 4px solid #7C3AED;">
                <h2 style="font-size: 14px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 16px 0; font-weight: 700;">Détails du rendez-vous</h2>
                
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700;">Service</div>
                    <div style="font-size: 18px; color: #1e293b; font-weight: 700;">${serviceName}</div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700;">Établissement</div>
                    <div style="font-size: 16px; color: #475569; font-weight: 600;">${businessName}</div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700;">📅 Date & Heure</div>
                    <div style="font-size: 16px; color: #475569; font-weight: 600;">
                        ${format(startAt, "EEEE d MMMM yyyy", { locale: fr })} à ${format(startAt, "HH:mm")} - ${format(endAt, "HH:mm")}
                    </div>
                </div>

                ${address ? `
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700;">📍 Adresse</div>
                    <div style="font-size: 16px; color: #475569; font-weight: 600;">${address}</div>
                </div>
                ` : ''}

                ${phone ? `
                <div>
                    <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; font-weight: 700;">📞 Contact</div>
                    <div style="font-size: 16px; color: #475569; font-weight: 600;">${phone}</div>
                </div>
                ` : ''}
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/client/dashboard" 
                   style="display: inline-block; background-color: #7C3AED; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);">
                    Voir mes rendez-vous
                </a>
            </div>

            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 32px 0 0 0; text-align: center;">
                Besoin d'annuler ou de modifier votre rendez-vous ?<br>
                Connectez-vous à votre espace client NEXO.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                Propulsé par <span style="color: #7C3AED; font-weight: 900;">NEXO</span>
            </p>
            <p style="font-size: 11px; color: #cbd5e1; margin: 8px 0 0 0;">
                La plateforme de réservation nouvelle génération
            </p>
        </div>
    </div>
</body>
</html>
    `.trim()
}

export function reminderEmailTemplate(data: AppointmentEmailData) {
    const { clientName, serviceName, businessName, startAt, address } = data

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rappel de rendez-vous</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <div style="background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px;">⏰ RAPPEL</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Rendez-vous demain</p>
        </div>

        <div style="padding: 40px 30px; text-align: center;">
            <p style="font-size: 18px; color: #1e293b; margin: 0 0 16px 0; font-weight: 600;">
                Bonjour ${clientName},
            </p>

            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 32px 0;">
                Nous vous rappelons votre rendez-vous <strong>demain</strong> pour <strong style="color: #F59E0B;">${serviceName}</strong> chez <strong>${businessName}</strong>.
            </p>

            <div style="background-color: #fef3c7; border-radius: 16px; padding: 24px; margin-bottom: 32px;">
                <div style="font-size: 14px; color: #92400e; margin-bottom: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">📅 Demain</div>
                <div style="font-size: 24px; color: #78350f; font-weight: 900; margin-bottom: 16px;">
                    ${format(startAt, "HH:mm")}
                </div>
                ${address ? `
                <div style="font-size: 14px; color: #92400e; font-weight: 600;">
                    📍 ${address}
                </div>
                ` : ''}
            </div>

            <p style="font-size: 14px; color: #94a3b8; margin: 0;">
                À très bientôt !
            </p>
        </div>

        <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                Propulsé par <span style="color: #7C3AED; font-weight: 900;">NEXO</span>
            </p>
        </div>
    </div>
</body>
</html>
    `.trim()
}

interface VerificationEmailData {
    name: string
    verificationUrl: string
}

export function verificationEmailTemplate(data: VerificationEmailData) {
    const { name, verificationUrl } = data

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Activez votre compte NEXO</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10B981 0%, #34D399 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -1px;">✅ BIENVENUE</h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; font-weight: 600; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 2px;">Activez votre compte</p>
        </div>

        <!-- Content -->
        <div style="padding: 40px 30px;">
            <p style="font-size: 18px; color: #1e293b; margin: 0 0 24px 0; font-weight: 600;">
                Bonjour ${name},
            </p>

            <p style="font-size: 16px; color: #475569; line-height: 1.6; margin: 0 0 32px 0;">
                Merci de vous être inscrit sur <strong style="color: #7C3AED;">NEXO</strong> ! Pour activer votre compte et commencer à réserver vos prestations, veuillez cliquer sur le bouton ci-dessous :
            </p>

            <!-- CTA Button -->
            <div style="text-align: center; margin: 32px 0;">
                <a href="${verificationUrl}" 
                   style="display: inline-block; background-color: #10B981; color: #ffffff; padding: 18px 40px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 1.5px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                    Activer mon compte
                </a>
            </div>

            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 32px 0 0 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${verificationUrl}" style="color: #7C3AED; word-break: break-all;">${verificationUrl}</a>
            </p>

            <div style="background-color: #fef3c7; border-left: 4px solid #F59E0B; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <p style="font-size: 13px; color: #92400e; margin: 0; font-weight: 600;">
                    ⏰ <strong>Important :</strong> Ce lien est valide pendant 24 heures.
                </p>
            </div>

            <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 24px 0 0 0;">
                Si vous n'avez pas créé de compte NEXO, vous pouvez ignorer cet email en toute sécurité.
            </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">
                Propulsé par <span style="color: #7C3AED; font-weight: 900;">NEXO</span>
            </p>
            <p style="font-size: 11px; color: #cbd5e1; margin: 8px 0 0 0;">
                La plateforme de réservation nouvelle génération
            </p>
        </div>
    </div>
</body>
</html>
    `.trim()
}
