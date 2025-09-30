import pandas as pd
from typing import Tuple, Optional

class ExcelProcessor:
    def __init__(self, file_path: Optional[str] = None, df: Optional[pd.DataFrame] = None):
        self.file_path = file_path
        self.df = df if df is not None else (pd.read_excel(file_path) if file_path else None)

    @staticmethod
    def procesar_df(df: pd.DataFrame) -> Tuple[float, int]:
        columnas_requeridas = {'Pedido Número', 'Estado'}
        faltantes_base = [c for c in columnas_requeridas if c not in df.columns]
        if faltantes_base:
            raise KeyError(f"Faltan columnas requeridas en el Excel: {', '.join(faltantes_base)}")

        work = df.copy()
        work['__exitoso_fila'] = work['Estado'].astype(str).str.strip().str.lower().eq('exitoso')

        agrupado = (
            work.groupby('Pedido Número', as_index=False)
                .agg(__exitoso_pedido=('__exitoso_fila', 'any'))
        )

        total_registros = len(agrupado)
        registros_exitosos = int(agrupado['__exitoso_pedido'].sum())
        efectividad = (registros_exitosos / total_registros) * 100 if total_registros > 0 else 0
        return efectividad, total_registros

    def procesar_archivo(self) -> Tuple[float, int]:
        if self.df is None:
            raise ValueError("No hay DataFrame cargado")
        return ExcelProcessor.procesar_df(self.df)