import os
import json
from typing import List, Dict, Any

from db_manager import DatabaseManager


def export_stats(output_path: str = os.path.join('docs', 'data', 'stats.json')) -> None:
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    db = DatabaseManager()
    rows = db.obtener_estadisticas()
    payload: List[Dict[str, Any]] = []
    for archivo, fecha_proceso, efectividad, total_registros in rows:
        payload.append({
            'archivo': archivo,
            'fecha_proceso': fecha_proceso,
            'efectividad': efectividad,
            'total_registros': total_registros,
        })
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"Exportado {len(payload)} registros a {output_path}")


if __name__ == '__main__':
    export_stats()
