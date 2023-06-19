from sqlalchemy import select, column
from typing import Dict, Any, List
from typing_extensions import TypedDict

from .shared.helpers import return_data, get_record_type
from .shared.types import Table, Student, Course, Result
from .shared.sql_api_fn import sql_api_fn, SQLApiRequest


class Query(TypedDict):
    fields: List[str] or None
    fields_equal: dict or None
    fields_not_equal: dict or None


def get_query_filters(params: dict) -> Query:
	query_data: Query = {
		'fields_equal': {},
		'fields_not_equal': {}
	}

	for key, val in params.items():
		if key == 'fields':
			query_data['fields'] = val.split(',')
		elif key == 'filters':
			filters = val.split(',')
			for filter in filters:
				if '!=' in filter:
					filter_attr, param_splitter = 'fields_not_equal', '!='
				else:
					filter_attr, param_splitter = 'fields_equal', '='
				
				field, filter_val = filter.split(param_splitter)
				query_data[filter_attr][field] = filter_val
		else:
			print(f'Unkown parameter key: {key}')

	return query_data


@sql_api_fn
def handler(event: Dict[str, Any], context: Any, req: SQLApiRequest):
	query_data = get_query_filters(event.get('queryStringParameters', {}))

	print(query_data)
	record_type = get_record_type(req.table_name)
	if query_data.get('fields'):
		query = req.session.query(*[getattr(record_type, name) for name in query_data['fields']])
	else:
		query = select(req.table)

	for col, value in query_data.get('fields_equal', {}).items():
		query = query.filter(getattr(record_type, col) == value)

	for col, value in query_data.get('fields_not_equal', {}).items():
		query = query.filter(getattr(record_type, col) != value)

	result = req.session.execute(query)
	column_names = result.keys()
	data = [dict(zip(column_names, row)) for row in result.fetchall()]

	return return_data(data)


# print(handler({ 'pathParameters': { 'table': 'students' }, 'queryStringParameters': {
#   "fields": "first_name",
#   "filters": "first_name=Test"
# }}, None))