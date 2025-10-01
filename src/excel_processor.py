import pandas as pd
from typing import Tuple

class ExcelProcessor:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.df = pd.read_excel(file_path)

    def procesar_archivo(self) -> Tuple[float, int]:
        """
        Procesa el archivo Excel y calcula las estadísticas necesarias.
        
        Returns:
            Tuple[float, int]: 
                - Porcentaje de efectividad
                - Total de registros (pedidos únicos)
        """
        # Validar columnas requeridas y soportar variantes de nombre
        columnas_requeridas = {'Pedido Número', 'Estado'}
        faltantes_base = [c for c in columnas_requeridas if c not in self.df.columns]
        if faltantes_base:
            raise KeyError(f"Faltan columnas requeridas en el Excel: {', '.join(faltantes_base)}")

        df = self.df.copy()
        # Normalizar éxito por fila
        df['__exitoso_fila'] = df['Estado'].astype(str).str.strip().str.lower().eq('exitoso')

        # Agregar por pedido: un pedido es exitoso si cualquiera de sus filas lo fue
        agrupado = (
            df.groupby('Pedido Número', as_index=False)
              .agg(__exitoso_pedido=('__exitoso_fila', 'any'))
        )

        total_registros = len(agrupado)
        registros_exitosos = int(agrupado['__exitoso_pedido'].sum())
        efectividad = (registros_exitosos / total_registros) * 100 if total_registros > 0 else 0

        return efectividad, total_registros