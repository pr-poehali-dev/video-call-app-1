"""Проверка кода доступа администратора ConnectX"""
import json
import os
import hashlib
import time


def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    if event.get('httpMethod') != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
        }

    body = json.loads(event.get('body', '{}'))
    code = body.get('code', '')

    admin_code = os.environ.get('ADMIN_CODE', '')

    if not admin_code:
        return {
            'statusCode': 500,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Admin code not configured'}),
        }

    is_valid = code == admin_code

    token = ''
    if is_valid:
        raw = f"{admin_code}-{int(time.time() // 3600)}-connectx-admin"
        token = hashlib.sha256(raw.encode()).hexdigest()[:32]

    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
        },
        'body': json.dumps({
            'valid': is_valid,
            'token': token,
        }),
    }
