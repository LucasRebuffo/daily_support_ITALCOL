import sqlite3
from typing import List, Tuple
from datetime import datetime

class DatabaseManager:
    def __init__(self, db_file: str = 'excel_stats.db'):
        self.db_file = db_file
        self.init_database()

    def init_database(self):
        """Inicializa la base de datos creando las tablas necesarias si no existen."""
        with sqlite3.connect(self.db_file) as conn:
            cursor = conn.cursor()
            
            # Tabla para estadísticas generales
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS stats (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    archivo TEXT NOT NULL,
                    fecha_proceso TIMESTAMP NOT NULL,
                    efectividad REAL NOT NULL,
                    total_registros INTEGER NOT NULL
                )
            ''')
            
            # Nota: ya no almacenamos observaciones
            
            conn.commit()

    def guardar_estadisticas(self, archivo: str, efectividad: float, 
                           total_registros: int) -> None:
        """
        Guarda las estadísticas en la base de datos.
        
        Args:
            archivo (str): Nombre del archivo procesado
            efectividad (float): Porcentaje de efectividad
            total_registros (int): Total de registros procesados
        """
        with sqlite3.connect(self.db_file) as conn:
            cursor = conn.cursor()
            
            # Insertar estadísticas generales
            cursor.execute('''
                INSERT INTO stats (archivo, fecha_proceso, efectividad, total_registros)
                VALUES (?, ?, ?, ?)
            ''', (archivo, datetime.now(), efectividad, total_registros))
            
            conn.commit()

    def obtener_estadisticas(self) -> List[Tuple]:
        """
        Obtiene todas las estadísticas almacenadas.
        
        Returns:
            List[Tuple]: Lista de tuplas con las estadísticas
        """
        with sqlite3.connect(self.db_file) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT s.archivo, s.fecha_proceso, s.efectividad, s.total_registros
                FROM stats s
                ORDER BY s.fecha_proceso DESC
            ''')
            return cursor.fetchall()