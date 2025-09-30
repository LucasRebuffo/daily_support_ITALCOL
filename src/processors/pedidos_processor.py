from __future__ import annotations
from typing import Tuple, Optional

import pandas as pd

from excel_processor import ExcelProcessor
from processors.base_processor import BaseExcelProcessor


class SincronizacionPedidosProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Sincronizacion de pedidos"

    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        df = pd.read_excel(file_path)
        # Optional date filtering if configured later
        if self.datetime_column_name and (self.start_datetime or self.end_datetime) and self.datetime_column_name in df.columns:
            ser = pd.to_datetime(df[self.datetime_column_name], errors='coerce')
            if self.start_datetime:
                df = df[ser >= pd.to_datetime(self.start_datetime, errors='coerce')]
            if self.end_datetime:
                df = df[ser <= pd.to_datetime(self.end_datetime, errors='coerce')]
        return ExcelProcessor.procesar_df(df)
