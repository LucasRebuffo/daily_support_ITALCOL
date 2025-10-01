// Processors for different report types using Danfo.js
export class Processors {
  static async processPedidos(df) {
    try {
      // Convert JSON array to Danfo DataFrame
      const df_danfo = new dfd.DataFrame(df);
      
      // Check required columns
      const cols = df_danfo.columns;
      if (!(cols.includes('Pedido Número') && cols.includes('Estado'))) {
        console.log('Columnas encontradas:', cols);
        throw new Error('Faltan columnas requeridas: Pedido Número, Estado');
      }
      
      // Normalize Estado column to lowercase
      df_danfo['Estado'] = df_danfo['Estado'].str.toLowerCase().str.trim();
      
      // Create success flag
      df_danfo.addColumn('__exitoso', df_danfo['Estado'].eq('exitoso'));
      
      // Group by Pedido Número and check if any row is successful
      const grouped = df_danfo.groupby(['Pedido Número']).agg({
        '__exitoso': 'any'
      });
      
      const total = grouped.shape[0];
      const exitosos = grouped['__exitoso'].sum();
      const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
      
      return { efectividad, total };
    } catch (error) {
      console.error('Error en processPedidos:', error);
      throw error;
    }
  }

  static async processFacturaElectronica(df) {
    try {
      // Convert JSON array to Danfo DataFrame
      const df_danfo = new dfd.DataFrame(df);
      
      // Check required columns
      const cols = df_danfo.columns;
      if (!(cols.includes('Factura') && cols.includes('Estado proceso'))) {
        throw new Error('Faltan columnas requeridas: Factura, Estado proceso');
      }
      
      // Normalize Estado proceso column to lowercase
      df_danfo['Estado proceso'] = df_danfo['Estado proceso'].str.toLowerCase().str.trim();
      
      // Create success flag
      df_danfo.addColumn('__exitoso', df_danfo['Estado proceso'].eq('exitoso'));
      
      // Group by Factura and check if any row is successful
      const grouped = df_danfo.groupby(['Factura']).agg({
        '__exitoso': 'any'
      });
      
      const total = grouped.shape[0];
      const exitosos = grouped['__exitoso'].sum();
      const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
      
      return { efectividad, total };
    } catch (error) {
      console.error('Error en processFacturaElectronica:', error);
      throw error;
    }
  }

  static async processConciliacionDian(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processConciliacionDian:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processConciliacionTc(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processConciliacionTc:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processEventosAcuseDian(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
      return { efectividad: 0, total: df_danfo.shape[0] };
    } catch (error) {
      console.error('Error en processEventosAcuseDian:', error);
      return { efectividad: 0, total: df.length };
    }
  }

  static async processFacturaAgenciaViajes(df) {
    try {
      const df_danfo = new dfd.DataFrame(df);
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
  if (!colName || !df[0] || !(colName in df[0])) return df;
  
  try {
    const df_danfo = new dfd.DataFrame(df);
    
    // Convert date column to datetime
    df_danfo[colName] = df_danfo[colName].astype('datetime');
    
    let filtered_df = df_danfo;
    
    // Apply start date filter
    if (startISO) {
      const startDate = new Date(startISO);
      filtered_df = filtered_df.query(filtered_df[colName].gte(startDate));
    }
    
    // Apply end date filter
    if (endISO) {
      const endDate = new Date(endISO);
      filtered_df = filtered_df.query(filtered_df[colName].lte(endDate));
    }
    
    // Convert back to JSON array
    return await filtered_df.toJSON();
  } catch (error) {
    console.error('Error en filterByDatetime:', error);
    // Fallback to original method
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
        
        // Determine sheet name
        let wsName;
        if (processType === 'Factura electronica') {
          wsName = 'Facturas';
        } else {
          wsName = wb.SheetNames[0];
        }
        
        const ws = wb.Sheets[wsName];
        const json = XLSX.utils.sheet_to_json(ws, { defval: null });
        
        // Apply date filtering if specified using Danfo.js
        const filtered = await filterByDatetime(json, datetimeColumn, startISO, endISO);
        
        // Process with appropriate processor (now async)
        const processor = Processors.getProcessor(processType);
        const { efectividad, total } = await processor(filtered);
        
        resolve({
          archivo: file.name,
          efectividad,
          total_registros: total,
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
