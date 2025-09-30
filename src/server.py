from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import tempfile
import os

from db_manager import DatabaseManager
from processors import (
    SincronizacionPedidosProcessor,
    ConciliacionDianProcessor,
    ConciliacionTcProcessor,
    EventosAcuseDianProcessor,
    FacturaAgenciaViajesProcessor,
    FacturaElectronicaProcessor,
)

app = FastAPI(title="ITALCOL Processing API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PROCESSOR_MAP = {
    "Sincronizacion de pedidos": SincronizacionPedidosProcessor,
    "Conciliacion DIAN": ConciliacionDianProcessor,
    "Conciliacion TC": ConciliacionTcProcessor,
    "Eventos acuse DIAN": EventosAcuseDianProcessor,
    "Factura agencia de viajes": FacturaAgenciaViajesProcessor,
    "Factura electronica": FacturaElectronicaProcessor,
}

ROOT_INSUMOS = os.path.join(".", "INSUMOS")


@app.post("/process")
async def process_files(
    files: List[UploadFile] = File(...),
    process_type: str = Form(...),
    start_datetime: Optional[str] = Form(None),
    end_datetime: Optional[str] = Form(None),
    datetime_column: Optional[str] = Form(None),
):
    if process_type not in PROCESSOR_MAP:
        return {"error": f"process_type inválido: {process_type}"}

    db = DatabaseManager()
    processor_cls = PROCESSOR_MAP[process_type]
    processor = processor_cls(
        ROOT_INSUMOS,
        db_manager=db,
        start_datetime=start_datetime,
        end_datetime=end_datetime,
        datetime_column_name=datetime_column,
    )

    results = []
    for up in files:
        # Persist to a temporary file to be readable by pandas
        suffix = os.path.splitext(up.filename)[1]
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
            content = await up.read()
            tmp.write(content)
            tmp_path = tmp.name
        try:
            eff, total = processor.process_one_file(tmp_path)
            # Save stats
            db.guardar_estadisticas(up.filename, eff, total)
            results.append({
                "archivo": up.filename,
                "efectividad": eff,
                "total_registros": total,
            })
        finally:
            try:
                os.remove(tmp_path)
            except OSError:
                pass

    return {"procesados": results}


@app.get("/stats")
async def get_stats():
    db = DatabaseManager()
    rows = db.obtener_estadisticas()
    return [
        {
            "archivo": r[0],
            "fecha_proceso": r[1],
            "efectividad": r[2],
            "total_registros": r[3],
        }
        for r in rows
    ]
