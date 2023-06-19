from typing import Dict, Any

from .shared.helpers import return_data, get_record_type
from .shared.sql_api_fn import sql_api_fn, SQLApiRequest


@sql_api_fn
def handler(event: Dict[str, Any], context: Any, req: SQLApiRequest):
    record_type = get_record_type(req.table_name)
    item = req.session.query(record_type).get(req.item_id)

    if item is not None:
        req.session.delete(item)
    else:
        return return_data({ 'result': 'not_found', 'message': f'No item found in {req.table_name} table with ID {req.item_id}' })

    return return_data({ 'result': 'success' })


# print(handler({
#     'pathParameters': {
#         'table': 'students',
#         'itemId': 10
#     }
# }, None))