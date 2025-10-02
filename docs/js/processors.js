// Procesadores para distintos tipos de reportes usando Danfo.js
console.log('docs/js/processors.js cargado');
export class Processors {
  static async processPedidos(df) {
    try {
      // Convertir array JSON a DataFrame de Danfo.js
      const df_danfo = new dfd.DataFrame(df);
      console.log('processPedidos: inicio, filas entrada =', df_danfo.shape[0]);
      
  // Verificar columnas requeridas
  const cols = df_danfo.columns;
      if (!(cols.includes('Pedido Número') && cols.includes('Estado'))) {
        console.log('Columnas encontradas:', cols);
        throw new Error('Faltan columnas requeridas: Pedido Número, Estado');
      }
      
  // Normalizar columna Estado a minúsculas
  df_danfo['Estado'] = df_danfo['Estado'].str.toLowerCase().str.trim();
      
  // Crear bandera de éxito
  df_danfo.addColumn('__exitoso', df_danfo['Estado'].eq('exitoso'));
      
      // Agrupar por Pedido Número y verificar si alguna fila es exitosa
      const grouped = df_danfo.groupby(['Pedido Número']).agg({
        '__exitoso': 'any'
      });
      
      const total = grouped.shape[0];
      const exitosos = grouped['__exitoso'].sum();
      const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
      
      console.log('processPedidos: resultado efectividad=', efectividad, 'total=', total);
      return { efectividad, total };
    } catch (error) {
      console.error('Error en processPedidos:', error);
      throw error;
    }
  }

  static async processFacturaElectronica(df) {
    try {
      // Convertir array JSON a DataFrame de Danfo.js
      const df_danfo = new dfd.DataFrame(df);
      console.log('processFacturaElectronica: inicio, filas entrada =', df_danfo.shape[0]);
      
  // Verificar columnas requeridas
  const cols = df_danfo.columns;
      if (!(cols.includes('Factura') && cols.includes('Estado proceso'))) {
        throw new Error('Faltan columnas requeridas: Factura, Estado proceso');
      }
      
  // Normalizar columna Estado proceso a minúsculas
  df_danfo['Estado proceso'] = df_danfo['Estado proceso'].str.toLowerCase().str.trim();
      
  // Crear bandera de éxito
  df_danfo.addColumn('__exitoso', df_danfo['Estado proceso'].eq('exitoso'));
      
      // Agrupar por Factura y verificar si alguna fila es exitosa
      const grouped = df_danfo.groupby(['Factura']).agg({
        '__exitoso': 'any'
      });
      
      const total = grouped.shape[0];
      const exitosos = grouped['__exitoso'].sum();
      const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
      
      console.log('processFacturaElectronica: resultado efectividad=', efectividad, 'total=', total);
      return { efectividad, total };
    } catch (error) {
      console.error('Error en processFacturaElectronica:', error);
      throw error;
    }
  }

  static async processConciliacionDian(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      console.log('processConciliacionDian: filas =', df_danfo.shape[0]);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processConciliacionDian:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processConciliacionTc(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      console.log('processConciliacionTc: filas =', df_danfo.shape[0]);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processConciliacionTc:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processEventosAcuseDian(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      console.log('processEventosAcuseDian: filas =', df_danfo.shape[0]);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processEventosAcuseDian:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processFacturaAgenciaViajes(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      console.log('processFacturaAgenciaViajes: filas =', df_danfo.shape[0]);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processFacturaAgenciaViajes:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static getProcessor(processType) {
    const processors = {
      'Sincronizacion de pedidos': Processors.processPedidos,
      'Factura electronica': Processors.processFacturaElectronica,
      'Conciliacion DIAN': Processors.processConciliacionDian,
      'Conciliacion TC': Processors.processConciliacionTc,
      'Eventos acuse DIAN': Processors.processEventosAcuseDian,
      'Factura agencia de viajes': Processors.processFacturaAgenciaViajes,
    };
    return processors[processType] || Processors.processConciliacionDian;
  }
}

// Date filtering utility using Danfo.js
export async function filterByDatetime(df, colName, startISO, endISO) {
  // Si no hay columna de fecha o datos, retornar el array original
  if (!colName || !df[0] || !(colName in df[0])) return df;
  
  try {
    const df_danfo = new dfd.DataFrame(df);
    console.log('filterByDatetime: inicio filas =', df_danfo.shape[0], 'columna=', colName);
    
    // Convertir la columna de fecha a tipo datetime
    df_danfo[colName] = df_danfo[colName].astype('datetime');
    
    let filtered_df = df_danfo;
    
    // Aplicar filtro de fecha inicial
    if (startISO) {
      const startDate = new Date(startISO);
      filtered_df = filtered_df.query(filtered_df[colName].gte(startDate));
    }
    
    // Aplicar filtro de fecha final
    if (endISO) {
      const endDate = new Date(endISO);
      filtered_df = filtered_df.query(filtered_df[colName].lte(endDate));
    }
    
    // Devolver como array JSON
    const result = await filtered_df.toJSON();
    console.log('filterByDatetime: filas resultantes =', result.length);
    return result;
  } catch (error) {
    console.error('Error en filterByDatetime:', error);
    // Fallback a método manual si Danfo falla
    const start = startISO ? new Date(startISO).getTime() : null;
    const end = endISO ? new Date(endISO).getTime() : null;
    
    return df.filter(r => {
      const v = r[colName];
      const t = v ? new Date(v).getTime() : NaN;
      if (isNaN(t)) return false;
      if (start !== null && t < start) return false;
      if (end !== null && t > end) return false;
      return true;
    });
  }
}

// Excel file reader with Danfo.js integration
export async function readExcelFile(file, processType, datetimeColumn, startISO, endISO) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        // Determinar hoja a usar
        let wsName;
        if (processType === 'Factura electronica') {
          wsName = 'Facturas';
        } else {
          wsName = wb.SheetNames[0];
        }
        console.log('readExcelFile: archivo=', file.name, 'hoja seleccionada=', wsName);

        const ws = wb.Sheets[wsName];
        const json = XLSX.utils.sheet_to_json(ws, { defval: null });
        console.log('readExcelFile: filas leidas =', json.length);

        // Aplicar filtro de fecha si corresponde
        const filtered = await filterByDatetime(json, datetimeColumn, startISO, endISO);
        console.log('readExcelFile: filas despues filtro =', filtered.length);

        // Procesar con el procesador correspondiente
        const processor = Processors.getProcessor(processType);
        console.log('readExcelFile: procesador seleccionado =', processType);
        const { efectividad, total } = await processor(filtered);
        console.log('readExcelFile: resultado =', { efectividad, total });

        resolve({
          archivo: file.name,
          efectividad,
          total_registros: total,
          totalRegistros: total,
          fecha_proceso: new Date().toISOString()
        });
      } catch (err) {
        console.error('Error en readExcelFile:', err);
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
