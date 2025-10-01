from __future__ import annotations
import os
import shutil
from datetime import datetime
from typing import Tuple, Optional

from db_manager import DatabaseManager


class BaseExcelProcessor:
    """Base class to define a contract for Excel processors."""

    # Folder name under INSUMOS this processor handles
    FOLDER_NAME: str = ""

    def __init__(self, root_insumos_dir: str, db_manager: Optional[DatabaseManager] = None):
        self.root_insumos_dir = root_insumos_dir
        self.db_manager = db_manager or DatabaseManager()

    @property
    def source_dir(self) -> str:
        return os.path.join(self.root_insumos_dir, self.FOLDER_NAME)

    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        """Process a single file and return (effectiveness, total_records).
        Must be implemented by subclasses.
        """
        raise NotImplementedError

    def archive_destination_dir(self) -> str:
        today = datetime.now().strftime('%d%m%Y')
        destination = os.path.join(self.source_dir, today)
        os.makedirs(destination, exist_ok=True)
        return destination

    def process_all_in_source(self) -> None:
        os.makedirs(self.source_dir, exist_ok=True)
        destination = self.archive_destination_dir()

        for entry in os.listdir(self.source_dir):
            if not entry.lower().endswith('.xlsx'):
                continue
            full_path = os.path.join(self.source_dir, entry)
            if os.path.isdir(full_path):
                continue
            try:
                effectiveness, total = self.process_one_file(full_path)
                # Default save
                self.db_manager.guardar_estadisticas(
                    os.path.basename(full_path), effectiveness, total
                )
                # Archive
                target = os.path.join(destination, entry)
                shutil.move(full_path, target)
                print(f"[{self.FOLDER_NAME}] {entry} -> Efectividad {effectiveness:.2f}% | Total {total} | Movido a {target}")
            except Exception as exc:
                print(f"[{self.FOLDER_NAME}] Error procesando {entry}: {exc}")
