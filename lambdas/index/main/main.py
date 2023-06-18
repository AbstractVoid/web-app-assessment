from typing import Dict, Any
import boto3
import json
import os
from sqlalchemy import create_engine, text

def get_secret():
  secret_value_resp = boto3.client('secretsmanager', region_name='us-east-1').get_secret_value(
    SecretId=os.getenv('SECRET_ARN')
  )
  return json.loads(secret_value_resp['SecretString'])

def handler(event: Dict[str, Any], lambdaContext: Any):
  input_data = json.loads(event.get('body', event))

  SECRET = get_secret()
  db_user = SECRET['username']
  db_password = SECRET['password']
  db_host = os.getenv('DB_HOST')
  db_port = os.getenv('DB_PORT')

  connection_string = f'mssql+pyodbc://{db_user}:{db_password}@{db_host}:{db_port}/main?driver=ODBC+Driver+17+for+SQL+Server'
  engine = create_engine(connection_string)

  query = "SELECT * FROM students"
  data = []
  with engine.connect() as connection:
    result = connection.execute(text(query))
    print(result)
    data = [dict(row) for row in result.mappings().all()]

  resp_headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  }

  return {
    'isBase64Encoded': False,
    'statusCode': 200,
    'headers': resp_headers,
    'body': json.dumps(data)
  }
