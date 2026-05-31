import os
import smtplib
from email.message import EmailMessage


def send_review_notification(
        to_email,
        name,
        idiom,
        status
):
    try:
        msg = EmailMessage()

        msg["Subject"] = f"Your idiom suggestion was {status}"
        msg["From"] = os.getenv("MAIL_FROM")
        msg["To"] = to_email

        greeting = f"Hello {name}," if name else "Hello,"

        msg.set_content(f"""
{greeting}

Your suggestion:

"{idiom}"

has been {status}.

Thank you for contributing to Heart Sayings.

Best regards,
Heart Sayings Team
""")

        with smtplib.SMTP(
            os.getenv("MAIL_SERVER"),
            int(os.getenv("MAIL_PORT"))
        ) as server:

            server.starttls()

            server.login(
                os.getenv("MAIL_USERNAME"),
                os.getenv("MAIL_PASSWORD")
            )

            server.send_message(msg)

        print("Email sent successfully")

        return True

    except Exception as e:
        print("Email sending failed:", e)
        return False