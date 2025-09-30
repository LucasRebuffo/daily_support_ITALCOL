from __future__ import annotations
from typing import Tuple

import pandas as pd

from processors.base_processor import BaseExcelProcessor


class ConciliacionDianProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Conciliacion DIAN"

    # TODO: Implementar
    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        df = pd.read_excel(file_path)
        total_rows = len(df)
        return 0.0, total_rows


class ConciliacionTcProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Conciliacion TC"

    # TODO: Implementar
    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        df = pd.read_excel(file_path)
        total_rows = len(df)
        return 0.0, total_rows


class EventosAcuseDianProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Eventos acuse DIAN"

    # TODO: Implementar
    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        df = pd.read_excel(file_path)
        total_rows = len(df)
        return 0.0, total_rows


class FacturaAgenciaViajesProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Factura agencia de viajes"

    # TODO: Implementar
    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        df = pd.read_excel(file_path)
        total_rows = len(df)
        return 0.0, total_rows


class FacturaElectronicaProcessor(BaseExcelProcessor):
    FOLDER_NAME = "Factura electronica"

    def process_one_file(self, file_path: str) -> Tuple[float, int]:
        # Leer hoja 'Facturas'
        df = pd.read_excel(file_path, sheet_name="Facturas")

        # Validar columnas requeridas
        required_cols = {"Factura", "Estado proceso"}
        missing = [c for c in required_cols if c not in df.columns]
        if missing:
            raise KeyError(f"Faltan columnas requeridas en el Excel: {', '.join(missing)}")

        work = df.copy()
        # Normalizar éxito por fila en 'Estado proceso'
        work["__exitoso_fila"] = (
            work["Estado proceso"].astype(str).str.strip().str.lower().eq("exitoso")
        )

        # Agrupar por 'Factura': una factura es exitosa si alguna fila lo es
        grouped = (
            work.groupby("Factura", as_index=False)
                .agg(__exitoso_doc=("__exitoso_fila", "any"))
        )

        total_docs = len(grouped)
        successful_docs = int(grouped["__exitoso_doc"].sum())
        effectiveness = (successful_docs / total_docs) * 100 if total_docs > 0 else 0.0

        return effectiveness, total_docs
