# ITALCOL - Dashboard de Estadísticas

Dashboard 100% cliente para procesar reportes Excel y calcular métricas de efectividad.

## Características

- **100% Cliente**: Todo el procesamiento ocurre en el navegador, sin servidor
- **Múltiples Procesos**: Soporte para diferentes tipos de reportes
- **Filtros de Fecha**: Filtrado opcional por rango de fecha/hora
- **Material UI**: Interfaz moderna y responsive
- **GitHub Pages**: Despliegue automático desde repositorio

## Procesos Soportados

### Implementados
- **Sincronización de Pedidos**: Requiere columnas `Pedido Número`, `Estado`
- **Factura Electrónica**: Requiere hoja `Facturas` y columnas `Factura`, `Estado proceso`

### Placeholders (a definir)
- Conciliación DIAN
- Conciliación TC  
- Eventos Acuse DIAN
- Factura Agencia de Viajes

## Uso

1. Abre `index.html` en tu navegador
2. Selecciona el tipo de proceso
3. Sube uno o más archivos `.xlsx`
4. (Opcional) Especifica columna de fecha/hora y rango
5. Haz clic en "Procesar"

Los resultados se muestran inmediatamente en la tabla.

## Despliegue en GitHub Pages

1. Sube el contenido de `docs/` a tu repositorio
2. En GitHub: Settings → Pages → Source: Deploy from a branch
3. Branch: `main`, Folder: `/docs`
4. Accede a `https://tu-usuario.github.io/tu-repo/`

## Estructura

```
docs/
├── index.html          # Punto de entrada
├── js/
│   ├── processors.js   # Lógica de procesamiento
│   └── components.js   # Componentes React
└── README.md          # Esta documentación
```

## Privacidad

- Los archivos se procesan localmente en tu navegador
- No se envían datos a ningún servidor
- Los resultados se mantienen solo en la sesión actual
