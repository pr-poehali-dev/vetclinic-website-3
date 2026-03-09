"""
Управление слотами записи на приём.
GET  / — список доступных слотов (для формы на сайте)
POST / — добавить слот (для врача)
DELETE / — удалить слот (для врача)
"""
import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
}

ADMIN_KEY = os.environ.get('ADMIN_KEY', '')


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')

    if method == 'GET':
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("""
            SELECT id, slot_date::text, slot_time::text
            FROM appointment_slots
            WHERE is_available = TRUE AND slot_date >= CURRENT_DATE
            ORDER BY slot_date, slot_time
        """)
        rows = cur.fetchall()
        conn.close()
        slots = [{'id': r[0], 'date': r[1], 'time': r[2][:5]} for r in rows]
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'slots': slots}, ensure_ascii=False)}

    admin_key = event.get('headers', {}).get('X-Admin-Key', '')
    if admin_key != ADMIN_KEY or not ADMIN_KEY:
        return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'Forbidden'})}

    body = json.loads(event.get('body') or '{}')

    if method == 'POST':
        slot_date = body.get('date')
        slot_time = body.get('time')
        if not slot_date or not slot_time:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'date and time required'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO appointment_slots (slot_date, slot_time) VALUES (%s, %s) ON CONFLICT DO NOTHING RETURNING id",
            (slot_date, slot_time)
        )
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    if method == 'DELETE':
        slot_id = body.get('id')
        if not slot_id:
            return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'id required'})}
        conn = get_conn()
        cur = conn.cursor()
        cur.execute("UPDATE appointment_slots SET is_available = FALSE WHERE id = %s", (slot_id,))
        conn.commit()
        conn.close()
        return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

    return {'statusCode': 405, 'headers': CORS, 'body': json.dumps({'error': 'Method not allowed'})}
