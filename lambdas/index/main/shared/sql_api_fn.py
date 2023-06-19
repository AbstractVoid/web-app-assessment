from typing import Dict, Any, Callable
from sqlalchemy import Table
from sqlalchemy.orm import Session
from traceback import print_exc, format_exc

from .helpers import get_path_parameters, get_db_session
from .helpers import return_data


class SQLApiRequest():
     
    def __init__(self, table_name: str, item_id: int or None, table: Table, session: Session):
        self.table_name = table_name
        self.item_id = item_id
        self.table = table
        self.session = session


def sql_api_fn(func: Callable[[Dict[str, Any], Any, SQLApiRequest], dict]):
    
    def wrapper(event: Dict[str, Any], context: Any):
        table_name, item_id = get_path_parameters(event)
        table, session = get_db_session(table_name)
        
        sql_request = SQLApiRequest(
            table_name,
            item_id,
            table,
            session
        )
        
        try:
            result = func(event, context, sql_request)
            session.commit()
        except Exception as e:
            session.rollback()
            print_exc()
            result = return_data({ 'status': 'error', 'error': format_exc() }, 500)
        finally:
            session.close()

        return result
    
    return wrapper