"""Отправка заявки на запись в Telegram и на почту, бронирование слота."""
import json
import os
import urllib.request
import urllib.parse
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    """Отправка заявки на запись в Telegram и на почту, бронирование слота."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": HEADERS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    pet = body.get("pet", "").strip()
    breed = body.get("breed", "").strip()
    symptoms = body.get("symptoms", "").strip()
    slot_id = body.get("slot_id")
    message = body.get("message", "").strip()

    if not name or not phone:
        return {"statusCode": 400, "headers": HEADERS, "body": json.dumps({"error": "Имя и телефон обязательны"})}

    slot_label = "—"
    if slot_id:
        import psycopg2
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor()
        cur.execute("SELECT slot_date::text, slot_time::text, is_available FROM appointment_slots WHERE id = %s", (slot_id,))
        row = cur.fetchone()
        if not row or not row[2]:
            conn.close()
            return {"statusCode": 409, "headers": HEADERS, "body": json.dumps({"error": "Выбранное время уже занято. Пожалуйста, выберите другое."})}
        slot_label = f"{row[0]} в {row[1][:5]}"
        cur.execute("INSERT INTO appointments (name, phone, pet, breed, symptoms, slot_id, message) VALUES (%s,%s,%s,%s,%s,%s,%s)", (name, phone, pet, breed, symptoms, slot_id, message))
        cur.execute("UPDATE appointment_slots SET is_available = FALSE WHERE id = %s", (slot_id,))
        conn.commit()
        conn.close()

    text = (
        f"🐾 *Новая запись — Ветклиника АГАУ*\n\n"
        f"👤 *Имя:* {name}\n"
        f"📞 *Телефон:* {phone}\n"
        f"🐶 *Питомец:* {pet or '—'}\n"
        f"🦮 *Порода:* {breed or '—'}\n"
        f"🩺 *Симптомы:* {symptoms or '—'}\n"
        f"🗓 *Дата и время:* {slot_label}\n"
        f"📝 *Комментарий:* {message or '—'}"
    )

    errors = []

    try:
        bot_token = os.environ["TELEGRAM_BOT_TOKEN"]
        chat_id = os.environ["TELEGRAM_CHAT_ID"]
        tg_url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
        tg_data = urllib.parse.urlencode({"chat_id": chat_id, "text": text, "parse_mode": "Markdown"}).encode()
        req = urllib.request.Request(tg_url, data=tg_data, method="POST")
        urllib.request.urlopen(req, timeout=10)
    except Exception as e:
        errors.append(f"Telegram: {e}")

    try:
        smtp_password = os.environ["SMTP_PASSWORD"]
        smtp_user = "comravet@mail.ru"
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Новая запись: {name} — {slot_label}"
        msg["From"] = smtp_user
        msg["To"] = smtp_user
        html_body = f"""
        <div style="font-family: Arial, sans-serif; max-width: 480px; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #059669; margin-top: 0;">🐾 Новая запись — Ветклиника АГАУ</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:40%;">Имя</td><td style="padding:8px 0;font-weight:600;">{name}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Телефон</td><td style="padding:8px 0;font-weight:600;">{phone}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Питомец</td><td style="padding:8px 0;">{pet or '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Порода</td><td style="padding:8px 0;">{breed or '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Симптомы</td><td style="padding:8px 0;">{symptoms or '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Дата и время</td><td style="padding:8px 0;font-weight:600;">{slot_label}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Комментарий</td><td style="padding:8px 0;">{message or '—'}</td></tr>
          </table>
        </div>
        """
        msg.attach(MIMEText(html_body, "html", "utf-8"))
        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
            server.login(smtp_user, smtp_password)
            server.sendmail(smtp_user, smtp_user, msg.as_string())
    except Exception as e:
        errors.append(f"Email: {e}")

    if errors:
        return {"statusCode": 500, "headers": HEADERS, "body": json.dumps({"error": "; ".join(errors)})}

    return {"statusCode": 200, "headers": HEADERS, "body": json.dumps({"ok": True})}