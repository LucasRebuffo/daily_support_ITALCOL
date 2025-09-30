import os
import shutil
from datetime import datetime
import traceback
from excel_processor import ExcelProcessor
from db_manager import DatabaseManager

class ExcelFileHandler:
    def __init__(self, carpeta_observada: str):
        self.carpeta_observada = carpeta_observada
        self.db_manager = DatabaseManager()

    def procesar_archivo(self, ruta_archivo: str):
        """
        Procesa un archivo Excel y guarda sus estadísticas.
        
        Args:
            ruta_archivo (str): Ruta completa al archivo Excel
        """
        try:
            # Procesar el archivo
            processor = ExcelProcessor(ruta_archivo)
            efectividad, total_registros = processor.procesar_archivo()
            
            # Guardar en la base de datos
            nombre_archivo = os.path.basename(ruta_archivo)
            self.db_manager.guardar_estadisticas(
                nombre_archivo,
                efectividad,
                total_registros
            )
            
            print(f"Archivo procesado exitosamente: {nombre_archivo}")
            print(f"Efectividad: {efectividad:.2f}%")
            print(f"Total registros: {total_registros}")
            
        except Exception as e:
            print(f"Error procesando el archivo {ruta_archivo}: {str(e)}")
            traceback.print_exc()

def main():
    # Carpeta a procesar una sola vez
    carpeta_observada = "./INSUMOS/Sincronizacion de pedidos"
    event_handler = ExcelFileHandler(carpeta_observada)

    # Crear carpeta de destino con fecha DDMMYYYY
    fecha_str = datetime.now().strftime('%d%m%Y')
    carpeta_destino = os.path.join(carpeta_observada, fecha_str)
    os.makedirs(carpeta_destino, exist_ok=True)

    # Procesar todos los .xlsx presentes y moverlos luego
    for archivo in os.listdir(carpeta_observada):
        if not archivo.lower().endswith('.xlsx'):
            continue
        ruta = os.path.join(carpeta_observada, archivo)
        if os.path.isdir(ruta):
            continue
        try:
            event_handler.procesar_archivo(ruta)
            destino = os.path.join(carpeta_destino, archivo)
            shutil.move(ruta, destino)
            print(f"Movido a: {destino}")
        except Exception as e:
            print(f"No se pudo mover {archivo}: {e}")
            traceback.print_exc()

if __name__ == "__main__":
    main()