from __future__ import annotations
import os
from datetime import datetime
from typing import Tuple, Optional

from db_manager import DatabaseManager


class BaseExcelProcessor:
    """Base class to define a contract for Excel processors."""

    FOLDER_NAME: str = ""

    def __init__(self, root_insumos_dir: str, db_manager: Optional[DatabaseManager] = None,
                 start_datetime: Optional[str] = None, end_datetime: Optional[str] = None,
                 datetime_column_name: Optional[str] = None):
        self.root_insumos_dir = root_insumos_dir
        self.db_manager = db_manager or DatabaseManager()
        self.start_datetime = start_datetime
        self.end_datetime = end_datetime
        self.datetime_column_name = datetime_column_name

    @property
    def source_dir(self) -> str:
        return os.path.join(self.root_insumos_dir, self.FOLDER_NAME)

    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        """Process a single file and return (effectiveness, total_records)."""
        raise NotImplementedError

    def process_all_in_source(self) -> None:
        os.makedirs(self.source_dir, exist_ok=True)

        for entry in os.listdir(self.source_dir):
            if not entry.lower().endswith('.xlsx'):
                continue
            full_path = os.path.join(self.source_dir, entry)
            if os.path.isdir(full_path):
                continue
            try:
                effectiveness, total = self.process_one_file(full_path)
                self.db_manager.guardar_estadisticas(
                    os.path.basename(full_path), effectiveness, total
                )
                # Delete source file after processing (do not archive)
                os.remove(full_path)
                print(f"[{self.FOLDER_NAME}] {entry} -> Efectividad {effectiveness:.2f}% | Total {total} | Eliminado")
            except Exception as exc:
                print(f"[{self.FOLDER_NAME}] Error procesando {entry}: {exc}")
