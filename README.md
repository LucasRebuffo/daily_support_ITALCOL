## Daily Support ITALCOL - Procesamiento de pedidos (Excel)

Herramienta para procesar archivos Excel de pedidos, calcular efectividad por pedido y registrar resultados en una base de datos SQLite local.

### Requisitos
- Python 3.10+ recomendado
- Windows PowerShell (o cualquier terminal)

### Instalación
1. (Opcional) Crear y activar entorno virtual
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```
2. Instalar dependencias
```powershell
pip install -r requirements.txt
```

### Estructura de carpetas esperada
- `INSUMOS/Sincronizacion de pedidos/` → Aquí pones los archivos `.xlsx` a procesar
- `src/` → Código fuente
- `excel_stats.db` → Base de datos SQLite generada automáticamente

Nota: La carpeta `INSUMOS/` está en `.gitignore` para evitar subir datos.

### Uso rápido
1. Copia los archivos Excel a `INSUMOS/Sincronizacion de pedidos/`.
2. Ejecuta el script principal:
```powershell
python .\src\main.py
```
3. ¿Qué hace?
- Procesa todos los `.xlsx` en `INSUMOS/Sincronizacion de pedidos/` (ignora subcarpetas).
- Calcula:
  - Efectividad (%): un pedido es exitoso si alguna de sus filas tiene `Estado = "Exitoso"`.
  - Total de pedidos únicos (`Pedido Número`).
- Guarda estadísticas en `excel_stats.db` (tabla `stats`).
- Mueve cada archivo procesado a una subcarpeta con la fecha actual `DDMMYYYY` dentro de `INSUMOS/Sincronizacion de pedidos/`.

### Formato de entrada (Excel)
El archivo debe contener, al menos, las columnas:
- `Pedido Número`
- `Estado` (se considera exitoso cuando su valor es "Exitoso", sin importar mayúsculas/minúsculas)

Si faltan estas columnas, el proceso fallará con un error indicando las columnas faltantes.

### Salida y base de datos
- Base de datos: `excel_stats.db` (SQLite)
- Tabla: `stats`
  - `archivo` (TEXT)
  - `fecha_proceso` (TIMESTAMP)
  - `efectividad` (REAL)
  - `total_registros` (INTEGER)

#### Consultar resultados rápidamente (opcional)
Desde PowerShell, puedes usar `python` para imprimir últimas filas:
```powershell
python - << 'PY'
import sqlite3
conn = sqlite3.connect('excel_stats.db')
cur = conn.cursor()
for row in cur.execute('SELECT archivo, fecha_proceso, efectividad, total_registros FROM stats ORDER BY fecha_proceso DESC LIMIT 20'):
    print(row)
conn.close()
PY
```

### Errores comunes
- "Faltan columnas requeridas": verifica que el Excel tenga `Pedido Número` y `Estado`.
- "No se pudo mover ...": el archivo puede estar abierto en Excel; ciérralo e inténtalo de nuevo.
- Problemas de permisos: ejecuta la terminal como usuario con permisos de escritura en el directorio del proyecto.

### Desarrollo
Componentes principales:
- `src/excel_processor.py` → Lee el Excel con `pandas` y calcula estadísticas.
- `src/db_manager.py` → Crea la BD y guarda/consulta estadísticas.
- `src/main.py` → Orquesta el procesamiento por carpeta, loguea y mueve archivos.

### Licencia
Uso interno.
