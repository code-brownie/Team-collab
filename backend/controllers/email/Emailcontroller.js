const transporter = require("../../config/emailconfig");


const sendMail = async (req, res) => {
    const { email, joinCode, inviterId } = req.body;
    try {
        // Send email
        await transporter.sendMail({
            from: '"Team-Collab" <noreply@yourapp.com>',
            to: email,
            subject: "Invitation to Join Our Platform",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>You've Been Invited!</h2>
                    <p>Someone has invited you to join their team on Team-Collab.</p>
                    <p>Your join code is: <strong>${joinCode}</strong></p>
                    <p>To accept this invitation, please:</p>
                    <ol>
                        <li>Visit our website at [Your Website URL]</li>
                        <li>Click on "Join Team"</li>
                        <li>Enter the join code above</li>
                    </ol>
                    <p>This invitation will expire in 7 days.</p>
                    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
                </div>
            `,
        });

        res.status(200).json({ message: "Invitation sent successfully" });
    } catch (error) {
        console.error('Error sending invitation:', error);
        res.status(500).json({ error: "Failed to send invitation" });
    }
};

module.exports = sendMail;
