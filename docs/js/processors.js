// Processors for different report types
export class Processors {
  static processPedidos(df) {
    const cols = df[0] ? Object.keys(df[0]) : [];
    if (!(cols.includes('Pedido Número') && cols.includes('Estado'))) {
      console.log('Columnas encontradas:', cols);
      throw new Error('Faltan columnas requeridas: Pedido Número, Estado');
    }
    
    const byPedido = new Map();
    for (const row of df) {
      const pedido = row['Pedido Número'];
      const estado = String(row['Estado'] ?? '').trim().toLowerCase();
      const exito = estado === 'exitoso';
      
      if (!byPedido.has(pedido)) byPedido.set(pedido, false);
      if (exito) byPedido.set(pedido, true);
    }
    
    const total = byPedido.size;
    let exitosos = 0;
    for (const v of byPedido.values()) if (v) exitosos++;
    const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
    
    return { efectividad, total };
  }

  static processFacturaElectronica(df) {
    const cols = df[0] ? Object.keys(df[0]) : [];
    if (!(cols.includes('Factura') && cols.includes('Estado proceso'))) {
      throw new Error('Faltan columnas requeridas: Factura, Estado proceso');
    }
    
    const byFactura = new Map();
    for (const row of df) {
      const factura = row['Factura'];
      const estado = String(row['Estado proceso'] ?? '').trim().toLowerCase();
      const exito = estado === 'exitoso';
      
      if (!byFactura.has(factura)) byFactura.set(factura, false);
      if (exito) byFactura.set(factura, true);
    }
    
    const total = byFactura.size;
    let exitosos = 0;
    for (const v of byFactura.values()) if (v) exitosos++;
    const efectividad = total > 0 ? (exitosos / total) * 100 : 0;
    
    return { efectividad, total };
  }

  static processConciliacionDian(df) {
    // Placeholder - count rows
    return { efectividad: 0, total: df.length };
  }

  static processConciliacionTc(df) {
    // Placeholder - count rows
    return { efectividad: 0, total: df.length };
  }

  static processEventosAcuseDian(df) {
    // Placeholder - count rows
    return { efectividad: 0, total: df.length };
  }

  static processFacturaAgenciaViajes(df) {
    // Placeholder - count rows
    return { efectividad: 0, total: df.length };
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

// Date filtering utility
export function filterByDatetime(df, colName, startISO, endISO) {
  if (!colName || !df[0] || !(colName in df[0])) return df;
  
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

// Excel file reader
export function readExcelFile(file, processType, datetimeColumn, startISO, endISO) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
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
        
        // Apply date filtering if specified
        const filtered = filterByDatetime(json, datetimeColumn, startISO, endISO);
        
        // Process with appropriate processor
        const processor = Processors.getProcessor(processType);
        const { efectividad, total } = processor(filtered);
        
        resolve({
          archivo: file.name,
          efectividad,
          total_registros: total,
          fecha_proceso: new Date().toISOString()
        });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('No se pudo leer el archivo'));
    reader.readAsArrayBuffer(file);
  });
}
