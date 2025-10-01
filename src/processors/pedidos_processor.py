from __future__ import annotations
from typing import Tuple

from excel_processor import ExcelProcessor
from processors.base_processor import BaseExcelProcessor


class SincronizacionPedidosProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Sincronizacion de pedidos"

    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        processor = ExcelProcessor(file_path)
        return processor.procesar_archivo()
