// UI Components using React and Material UI
export function StatusChip({ value }) {
  const ok = typeof value === 'number' ? value >= 95 : false;
  const label = typeof value === 'number' ? value.toFixed(2) + '%' : String(value ?? '');
  return React.createElement(MaterialUI.Chip, {
    label,
    color: ok ? 'success' : 'default',
    variant: ok ? 'filled' : 'outlined'
  });
}

export function UploadPanel({ onResults }) {
  const [files, setFiles] = React.useState([]);
  const [processType, setProcessType] = React.useState('Sincronizacion de pedidos');
  const [startDt, setStartDt] = React.useState('');
  const [endDt, setEndDt] = React.useState('');
  const [datetimeColumn, setDatetimeColumn] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState(null);

  const processTypes = [
    'Sincronizacion de pedidos',
    'Conciliacion DIAN',
    'Conciliacion TC',
    'Eventos acuse DIAN',
    'Factura agencia de viajes',
    'Factura electronica',
  ];

  const handleSubmit = async () => {
    if (!files || files.length === 0) return;
    setBusy(true);
    setError(null);
    
    try {
      const results = [];
      for (const f of files) {
        console.log(`Procesando archivo: ${f.name}`);
        const res = await readExcelFile(
          f,
          processType,
          datetimeColumn || null,
          startDt || null,
          endDt || null
        );
        console.log(`Resultado para ${f.name}:`, res);
        results.push(res);
      }
      onResults && onResults(results);
      setFiles([]);
    } catch (e) {
      console.error('Error en handleSubmit:', e);
      setError(String(e));
    } finally {
      setBusy(false);
    }
  };

  return React.createElement(MaterialUI.Paper, { elevation: 1, sx: { p: 2 } },
    React.createElement(MaterialUI.Stack, { spacing: 2 },
      React.createElement(MaterialUI.Typography, { variant: 'h6' }, 'Subir archivos a procesar'),
      error && React.createElement(MaterialUI.Alert, { severity: 'error' }, String(error)),
      React.createElement(MaterialUI.Stack, { direction: 'row', spacing: 2, alignItems: 'center', flexWrap: 'wrap' },
        React.createElement(MaterialUI.FormControl, { size: 'small', sx: { minWidth: 280 } },
          React.createElement(MaterialUI.InputLabel, null, 'Proceso'),
          React.createElement(MaterialUI.Select, { 
            label: 'Proceso', 
            value: processType, 
            onChange: (e) => setProcessType(e.target.value) 
          },
            processTypes.map(pt => React.createElement(MaterialUI.MenuItem, { key: pt, value: pt }, pt))
          )
        ),
        React.createElement(MaterialUI.TextField, { 
          type: 'file', 
          inputProps: { multiple: true, accept: '.xlsx' }, 
          onChange: (e) => setFiles(Array.from(e.target.files || [])) 
        }),
        React.createElement(MaterialUI.TextField, { 
          size: 'small', 
          label: 'Columna fecha/hora (opcional)', 
          value: datetimeColumn, 
          onChange: (e) => setDatetimeColumn(e.target.value) 
        })
      ),
      React.createElement(MaterialUI.Stack, { direction: 'row', spacing: 2, alignItems: 'center' },
        React.createElement(MaterialUI.TextField, {
          type: 'datetime-local',
          label: 'Desde',
          value: startDt,
          onChange: (e) => setStartDt(e.target.value),
          InputLabelProps: { shrink: true }
        }),
        React.createElement(MaterialUI.TextField, {
          type: 'datetime-local',
          label: 'Hasta',
          value: endDt,
          onChange: (e) => setEndDt(e.target.value),
          InputLabelProps: { shrink: true }
        })
      ),
      React.createElement(MaterialUI.Stack, { direction: 'row', spacing: 2 },
        React.createElement(MaterialUI.Button, { 
          variant: 'contained', 
          onClick: handleSubmit, 
          disabled: busy || (files.length === 0) 
        }, busy ? 'Procesando...' : 'Procesar')
      )
    )
  );
}

export function ResultsTable({ rows, query, setQuery }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(r => (
      String(r.archivo ?? '').toLowerCase().includes(q)
    ));
  }, [rows, query]);

  const paged = React.useMemo(() => {
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, page, rowsPerPage]);

  React.useEffect(() => { setPage(0); }, [query, rowsPerPage]);

  return React.createElement(MaterialUI.Paper, { elevation: 1, sx: { p: 2 } },
    React.createElement(MaterialUI.Stack, { direction: 'row', spacing: 2, alignItems: 'center' },
      React.createElement(MaterialUI.Typography, { variant: 'h6' }, 'Registros (sesión actual)'),
      React.createElement(MaterialUI.Box, { sx: { flexGrow: 1 } }),
      React.createElement(MaterialUI.TextField, { 
        size: 'small', 
        label: 'Buscar por archivo', 
        value: query, 
        onChange: (e) => setQuery(e.target.value) 
      })
    ),
    React.createElement(MaterialUI.Box, { sx: { mt: 2 } },
      React.createElement(MaterialUI.Table, { size: 'small' },
        React.createElement(MaterialUI.TableHead, null,
          React.createElement(MaterialUI.TableRow, null,
            React.createElement(MaterialUI.TableCell, null, 'Archivo'),
            React.createElement(MaterialUI.TableCell, null, 'Fecha de proceso'),
            React.createElement(MaterialUI.TableCell, null, 'Efectividad'),
            React.createElement(MaterialUI.TableCell, null, 'Total registros')
          )
        ),
        React.createElement(MaterialUI.TableBody, null,
          paged.map((r, idx) => (
            React.createElement(MaterialUI.TableRow, { key: idx },
              React.createElement(MaterialUI.TableCell, null, r.archivo ?? ''),
              React.createElement(MaterialUI.TableCell, null, new Date(r.fecha_proceso).toLocaleString()),
              React.createElement(MaterialUI.TableCell, null, React.createElement(StatusChip, { value: r.efectividad })),
              React.createElement(MaterialUI.TableCell, null, r.total_registros ?? '')
            )
          ))
        )
      ),
      React.createElement(MaterialUI.TablePagination, {
        component: 'div',
        count: filtered.length,
        page,
        onPageChange: (e, p) => setPage(p),
        rowsPerPage,
        onRowsPerPageChange: (e) => setRowsPerPage(parseInt(e.target.value, 10)),
        rowsPerPageOptions: [5, 10, 25, 50]
      })
    )
  );
}
