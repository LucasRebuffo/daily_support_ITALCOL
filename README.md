# ITALCOL Daily Support - Aplicación JavaScript

Sistema completo de procesamiento de archivos Excel con análisis de estadísticas en tiempo real, construido con JavaScript puro y usando localStorage para almacenamiento.

## 🚀 Características

- **100% JavaScript del lado del cliente** - Sin servidor backend
-- **Almacenamiento local** - localStorage (sin servidor)
- **Procesamiento de Excel en tiempo real** - Análisis instantáneo
- **Interfaz moderna y responsiva** - Diseño atractivo y funcional
- **Múltiples tipos de proceso** - Soporte para diferentes formatos de Excel
- **Funciona offline** - localStorage como respaldo

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
-- Conexión a internet no requerida
- Archivos Excel (.xlsx)
- JavaScript habilitado

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd daily_support_ITALCOL
   ```

2. **Abrir la aplicación**
   ```bash
   # Opción 1: Servidor local simple
   python -m http.server 8000
   # Luego abrir http://localhost:8000/docs/
   
   # Opción 2: Demo interactiva
   # Abrir demo.html en el navegador
   
   # Opción 3: Pruebas de base de datos
   # Abrir test-database.html en el navegador
   
   # Opción 4: Aplicación principal
   # Abrir docs/index.html en el navegador
   ```

3. **Configuración de Almacenamiento**
   - **localStorage (predeterminado)**: Uso exclusivo de almacenamiento en el navegador
     - Los datos se guardan en el navegador
     - Funciona completamente offline

## 🎯 Uso

### Procesar Archivos Excel

1. **Abrir la aplicación** en el navegador
2. **Hacer clic en "Procesar Archivo Excel"**
3. **Seleccionar archivo** (.xlsx)
4. **Ver resultados** en tiempo real

### Tipos de Proceso Soportados

#### 📦 Sincronización de Pedidos
- **Columnas requeridas**: `Pedido Número`, `Estado`
- **Lógica**: Un pedido es exitoso si alguna fila tiene `Estado = "Exitoso"`
- **Cálculo**: Efectividad = (Pedidos exitosos / Total pedidos) × 100

#### 🧾 Factura Electrónica
- **Hoja requerida**: `Facturas`
- **Columnas requeridas**: `Factura`, `Estado proceso`
- **Lógica**: Una factura es exitosa si alguna fila tiene `Estado proceso = "Exitoso"`
- **Cálculo**: Efectividad = (Facturas exitosas / Total facturas) × 100

#### 📊 Procesos Genéricos
- **Cualquier archivo Excel**
- **Cálculo básico**: Cuenta total de filas
- **Efectividad**: 0% (placeholder)

## 🏗️ Arquitectura

### Estructura de Archivos
```
daily_support_ITALCOL/
├── docs/
│   ├── index.html      # Aplicación principal
│   ├── app.js         # Lógica de la aplicación
│   └── config.js      # Configuración
├── demo.html          # Demo interactiva
├── test.html          # Página de pruebas
├── test-database.html # Pruebas específicas de base de datos
└── README.md          # Documentación
```

### Componentes Principales

#### `ITALCOLApp` (app.js)
- **Gestión de almacenamiento**: Uso de localStorage
- **Procesamiento de Excel**: Análisis de archivos
- **Interfaz de usuario**: Renderizado dinámico
- **Gestión de estado**: Almacenamiento local

#### Funciones Clave
-- `initDatabase()`: Inicializa estructura en localStorage
-- `createTables()`: Crea/Verifica esquema lógico en localStorage
-- `processExcelFile()`: Procesa archivos Excel
-- `saveStats()`: Guarda estadísticas en localStorage
-- `loadStats()`: Carga estadísticas desde localStorage

## 🗄️ Base de Datos

### Esquema de Tabla `stats`
```sql
CREATE TABLE stats (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    archivo TEXT NOT NULL,
    fecha_proceso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    efectividad REAL NOT NULL,
    total_registros INTEGER NOT NULL,
    proceso TEXT NOT NULL DEFAULT 'General'
);
```

### Operaciones
- **INSERT**: Guardar nuevas estadísticas
- **SELECT**: Recuperar estadísticas ordenadas por fecha
- **CREATE TABLE**: Inicialización automática del esquema

## 🎨 Interfaz de Usuario

### Características del Diseño
- **Diseño moderno**: Gradientes y efectos de cristal
- **Responsive**: Adaptable a móviles y tablets
- **Interactivo**: Animaciones y transiciones suaves
- **Informativo**: Notificaciones y estados de carga

### Componentes Visuales
- **Header**: Título y descripción
- **Controles**: Botones de procesamiento y actualización
- **Estadísticas**: Grid de tarjetas con datos
- **Notificaciones**: Mensajes de éxito y error

## 🔧 Configuración Avanzada

### Configuración
> Nota: La aplicación usa exclusivamente localStorage; no es necesario configurar servicios externos.

### Agregar Nuevos Tipos de Proceso
```javascript
// En app.js, método determineProcessType()
if (name.includes('nuevo_proceso')) return 'Nuevo Proceso';

// Agregar método de procesamiento
async processNuevoProceso(workbook, filename) {
    // Lógica de procesamiento
    return { archivo, efectividad, totalRegistros };
}
```

## 🚀 Despliegue

### GitHub Pages
1. **Subir archivos** a repositorio
2. **Activar GitHub Pages** en Settings
3. **Seleccionar carpeta** `/docs`
4. **Acceder** a la URL generada

### Servidor Web
1. **Copiar carpeta** `docs/` al servidor
2. **Configurar** servidor web (Apache, Nginx)
3. **Abrir** `index.html`

## 🐛 Solución de Problemas

### Errores de almacenamiento
- Verificar que el navegador permite localStorage
- Revisar consola del navegador

### Error de Procesamiento de Excel
- Verificar formato del archivo (.xlsx)
- Comprobar columnas requeridas
- Revisar estructura del Excel

### Problemas de Rendimiento
- Limitar tamaño de archivos Excel
- Usar paginación para grandes datasets
- Optimizar consultas a base de datos

## 📈 Próximas Mejoras

- [ ] Soporte para más tipos de proceso
- [ ] Exportación de datos a diferentes formatos
- [ ] Filtros y búsqueda avanzada
- [ ] Gráficos y visualizaciones
- [ ] Modo offline con sincronización
- [ ] Autenticación de usuarios

## 📄 Licencia

Uso interno ITALCOL.

## 🤝 Contribución

Para contribuir al proyecto:
1. Fork del repositorio
2. Crear rama de feature
3. Realizar cambios
4. Crear pull request

---

**Desarrollado con ❤️ para ITALCOL**