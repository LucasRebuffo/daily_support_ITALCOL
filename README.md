## Daily Support ITALCOL - Procesamiento de Excel por procesos

Herramienta para procesar distintos tipos de reportes Excel en `INSUMOS/`, calcular métricas y registrar resultados en una base SQLite local.

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
- `INSUMOS/` → Carpeta raíz de insumos con subcarpetas por proceso:
  - `Sincronizacion de pedidos/`
  - `Conciliacion DIAN/`
  - `Conciliacion TC/`
  - `Eventos acuse DIAN/`
  - `Factura agencia de viajes/`
  - `Factura electronica/`
- `src/` → Código fuente
- `excel_stats.db` → Base de datos SQLite generada automáticamente
- `docs/` → Interfaz web (para GitHub Pages)

Nota: `INSUMOS/` está en `.gitignore` para evitar subir datos.

### Uso rápido (procesamiento)
1. Copia los archivos Excel `.xlsx` en la subcarpeta correspondiente dentro de `INSUMOS/`.
2. Ejecuta el script principal (procesa todas las subcarpetas conocidas):
```powershell
python .\src\main.py
```
3. ¿Qué hace? Para cada subcarpeta:
- Procesa todos los `.xlsx` (ignora subcarpetas).
- Calcula métricas específicas del proceso.
- Guarda estadísticas en `excel_stats.db` (tabla `stats`).
- Mueve cada archivo procesado a una subcarpeta con la fecha actual `DDMMYYYY` dentro de la misma carpeta del proceso.

### Web (GitHub Pages)
La UI está en `docs/` y se puede publicar con GitHub Pages (Branch: `main`, carpeta `/docs`). La UI carga `docs/data/stats.json` y muestra tabla paginada con Material UI.

- Exportar datos desde SQLite a JSON:
```powershell
python .\src\export_stats.py
```
Esto generará/actualizará `docs\data\stats.json`.

- Publicar en GitHub Pages:
  1) Commit y push de `docs/` y `docs/data/stats.json`.
  2) En GitHub → Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, Folder: `/docs`.
  3) Abrir la URL generada.

### Tipos de proceso soportados
- `Sincronizacion de pedidos` (implementado):
  - Columnas mínimas: `Pedido Número`, `Estado`
  - Efectividad (%): un pedido es exitoso si alguna de sus filas tiene `Estado = "Exitoso"`.
  - Total: cantidad de pedidos únicos por `Pedido Número`.
- `Factura electronica` (implementado):
  - Hoja: `Facturas`
  - Agrupar por: `Factura`
  - Condición de éxito (por fila): `Estado proceso` == `Exitoso` (ignorando mayúsculas/minúsculas y espacios)
  - Efectividad (%): una factura es exitosa si alguna fila del grupo lo es; total = facturas únicas.
- `Conciliacion DIAN`, `Conciliacion TC`, `Eventos acuse DIAN`, `Factura agencia de viajes`:
  - Actualmente placeholders: leen el Excel y contabilizan filas (efectividad = 0.0) hasta definir columnas y reglas. Indica columnas y lógica y lo implementamos.

### Salida y base de datos
- Base de datos: `excel_stats.db` (SQLite)
- Tabla: `stats`
  - `archivo` (TEXT)
  - `fecha_proceso` (TIMESTAMP)
  - `efectividad` (REAL)
  - `total_registros` (INTEGER)

#### Consultar resultados rápidamente (opcional)
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

### Desarrollo
Componentes principales:
- `src/processors/base_processor.py` → Base común: recorre carpeta, archiva por fecha, guarda estadísticas.
- `src/processors/pedidos_processor.py` → Lógica de "Sincronizacion de pedidos".
- `src/processors/placeholder_processor.py` → `Factura electronica` implementado; los demás procesos son placeholders a completar.
- `src/main.py` → Orquesta todos los procesadores.
- `src/export_stats.py` → Exporta `excel_stats.db` a `docs/data/stats.json` para la web.

### Errores comunes
- "Faltan columnas requeridas": en pedidos, verifica `Pedido Número` y `Estado`; en factura electrónica, `Factura` y `Estado proceso` y que exista hoja `Facturas`.
- "No se pudo mover ...": el archivo puede estar abierto en Excel; ciérralo e inténtalo de nuevo.
- Permisos: ejecuta la terminal con permisos de escritura en el proyecto.

### Próximos pasos
Indica para cada proceso las columnas y reglas de cálculo (por ejemplo: qué define "exitoso" o cómo agrupar), y actualizaremos los procesadores correspondientes.

### Licencia
Uso interno.
