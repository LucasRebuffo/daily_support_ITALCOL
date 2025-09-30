import os
from typing import List, Type

from db_manager import DatabaseManager
from processors import (
    BaseExcelProcessor,
    SincronizacionPedidosProcessor,
    ConciliacionDianProcessor,
    ConciliacionTcProcessor,
    EventosAcuseDianProcessor,
    FacturaAgenciaViajesProcessor,
    FacturaElectronicaProcessor,
)


ROOT_INSUMOS = os.path.join(".", "INSUMOS")


def build_processors(root_insumos: str, db: DatabaseManager) -> List[BaseExcelProcessor]:
    processor_classes: List[Type[BaseExcelProcessor]] = [
        SincronizacionPedidosProcessor,
        ConciliacionDianProcessor,
        ConciliacionTcProcessor,
        EventosAcuseDianProcessor,
        FacturaAgenciaViajesProcessor,
        FacturaElectronicaProcessor,
    ]
    return [cls(root_insumos, db) for cls in processor_classes]


def main():
    os.makedirs(ROOT_INSUMOS, exist_ok=True)
    db = DatabaseManager()

    processors = build_processors(ROOT_INSUMOS, db)

    for processor in processors:
        print(f"Procesando carpeta: {processor.source_dir}")
        processor.process_all_in_source()


if __name__ == "__main__":
    main()