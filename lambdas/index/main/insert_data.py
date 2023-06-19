from typing import Dict, Any
import json

from .shared.helpers import return_data, get_record_type
from .shared.sql_api_fn import sql_api_fn, SQLApiRequest


@sql_api_fn
def handler(event: Dict[str, Any], context: Any, req: SQLApiRequest):
    new_data = json.loads(event['body'])

    record_type = get_record_type(req.table_name)
    record = record_type(**new_data)
    req.session.add(record)
    req.session.flush()

    data = { key: val  for key, val in record.__dict__.items() if not key.startswith('_') }
    return return_data('success', data)


# from datetime import datetime
# print(handler({
#     'pathParameters': {
#         'table': 'students'
#     },
#     'body': json.dumps({
#         'first_name': 'Billy',
#         'family_name': 'Joel',
#         'dob': datetime.now(),
#         'email': 'JJJ@email.com'
#     }, default=str)
# }, None))