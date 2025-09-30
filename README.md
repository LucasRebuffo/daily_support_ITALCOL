## Daily Support ITALCOL - Procesamiento de Excel por procesos (sin API)

Herramienta para procesar reportes Excel directamente en el navegador (sin backend), calcular métricas y, opcionalmente, seguir usando el procesado por carpeta en local.

### Requisitos
- Cualquier navegador moderno
- (Opcional) Python 3.10+ si querés usar el procesamiento por carpeta local

### Uso en la web (100% estático)
1. Abrí `docs/index.html` (o publicalo en GitHub Pages).
2. En la sección "Subir archivos a procesar (client-side)":
   - Elegí el proceso.
   - Seleccioná uno o más `.xlsx`.
   - (Opcional) Indicá el nombre de la columna de fecha/hora y el rango a considerar.
3. La página calcula la efectividad y total por archivo en el navegador y muestra los resultados. Tus archivos no se suben a ningún servidor.

Procesos soportados en la web:
- `Sincronizacion de pedidos` (requiere columnas `Pedido Número`, `Estado`).
- `Factura electronica` (requiere hoja `Facturas` y columnas `Factura`, `Estado proceso`).
- Otros procesos: cuentan filas por ahora (placeholders) hasta definir reglas/columnas.

### Filtrado por fecha/hora (web)
- Indicá la columna que contiene fecha/hora y un rango. Si existe la columna, se filtra antes de calcular.
- Si necesitás columnas fijas por proceso, decime y las dejamos preconfiguradas.

### Procesamiento local por carpeta (opcional)
- Instalación deps (si usás Python):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
- Ejecutar procesamiento por carpetas `INSUMOS/`:
```powershell
python .\src\main.py
```
- Los archivos procesados se eliminan tras el análisis (no se guardan), y las métricas se escriben en `excel_stats.db`.

### Privacidad y versionado
- `.gitignore` protege `INSUMOS/` y formatos de reporte para evitar subir datos sensibles.

### Próximos pasos
- Indicá columnas/hojas y reglas para los procesos restantes y sumo la lógica a la web.
