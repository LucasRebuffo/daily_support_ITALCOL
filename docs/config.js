/**
 * Configuración de la aplicación ITALCOL
 */

const CONFIG = {
    // Uso exclusivo de localStorage para almacenamiento de datos

    // Configuración de la aplicación
    APP: {
        NAME: 'ITALCOL Daily Support',
        VERSION: '2.0.0',
        MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
        SUPPORTED_FORMATS: ['.xlsx'],
        REFRESH_INTERVAL: 30000 // 30 segundos
    },

    // Configuración de la base de datos
    DATABASE: {
        TABLE_NAME: 'stats',
        MAX_RECORDS: 1000,
        AUTO_REFRESH: true
    },

    // Configuración de la interfaz
    UI: {
        ANIMATION_DURATION: 300,
        NOTIFICATION_DURATION: 5000,
        CARDS_PER_PAGE: 20
    },

    // Tipos de proceso soportados
    PROCESS_TYPES: {
        'Sincronizacion de pedidos': {
            requiredColumns: ['Pedido Número', 'Estado'],
            successValue: 'exitoso',
            groupBy: 'Pedido Número'
        },
        'Factura electronica': {
            requiredColumns: ['Factura', 'Estado proceso'],
            successValue: 'exitoso',
            groupBy: 'Factura',
            sheetName: 'Facturas'
        },
        'Conciliacion DIAN': {
            requiredColumns: [],
            successValue: null,
            groupBy: null
        },
        'Conciliacion TC': {
            requiredColumns: [],
            successValue: null,
            groupBy: null
        },
        'Eventos acuse DIAN': {
            requiredColumns: [],
            successValue: null,
            groupBy: null
        },
        'Factura agencia de viajes': {
            requiredColumns: [],
            successValue: null,
            groupBy: null
        }
    }
};

// Exportar configuración
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}
