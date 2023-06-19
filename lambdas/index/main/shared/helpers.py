import boto3
import os
import json
from typing import Any, Dict, Tuple
from sqlalchemy import create_engine, MetaData, Table
from sqlalchemy.orm import sessionmaker, Session

from .types import Table as InternalTable, Student, Course, Result, Base


def get_secret() -> dict:
    secret_value_resp = boto3.client('secretsmanager', region_name='us-east-1').get_secret_value(
        SecretId=os.getenv('SECRET_ARN')
    )
    return json.loads(secret_value_resp['SecretString'])


def get_db_session(table_name: str) -> Session:
    SECRET = get_secret()
    db_user = SECRET['username']
    db_password = SECRET['password']
    db_host = os.getenv('DB_HOST')
    db_port = os.getenv('DB_PORT')

    connection_string = f'mssql+pyodbc://{db_user}:{db_password}@{db_host}:{db_port}/main?driver=ODBC+Driver+17+for+SQL+Server'
    engine = create_engine(connection_string)

    Session = sessionmaker(bind=engine)

    table = Table(table_name, MetaData(), autoload_with=engine)

    return table, Session()


def get_path_parameters(event: Dict[str, Any]) -> Tuple[str, int]:
    """ Returns Tuple[Table name, item ID] """
    path_params = event['pathParameters']

    item_id = path_params.get('itemId')
    if item_id:
        item_id = int(item_id)
    
    return path_params['table'], item_id


def get_record_type(table_name: str) -> Base:
    record_type = None
    if table_name == InternalTable.Students:
        record_type = Student
    elif table_name == InternalTable.Courses:
        record_type = Course
    elif table_name == InternalTable.Results:
        record_type = Result
    else:
        raise Exception(f'Unkown table name: {table_name}')

    return record_type


def return_data(result: str, data: Any, status=200) -> dict:
    resp_headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': '*'
    }

    resp_data = {
        'result': result
    }
    if data:
        resp_data['data'] = data

    return {
        'isBase64Encoded': False,
        'statusCode': status,
        'headers': resp_headers,
        'body': json.dumps(resp_data, default=str)
    }