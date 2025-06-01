import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  TableContainer,
} from '@mui/material';
import * as XLSX from 'xlsx';

const Home = () => {
  const [verbos, setVerbos] = useState([]);
  const [indiceActual, setIndiceActual] = useState(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const binaryStr = e.target.result;
      const wb = XLSX.read(binaryStr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const header = data.shift();

      if (header.join(',').toLowerCase() !== 'español,presente,pasado,participio,continuo,futuro') {
        alert('El archivo debe contener las columnas: Español, Presente, Pasado, Participio, Continuo, Futuro');
        return;
      }

      const verbosData = data.map(row => ({
        espanol: row[0],
        presente: row[1],
        pasado: row[2],
        participio: row[3],
        continuo: row[4],
        futuro: row[5],
      }));

      setVerbos(verbosData);
      setIndiceActual(0);
    };

    reader.readAsBinaryString(file);
  };

  const cambiarPalabra = () => {
    if (verbos.length > 0) {
      let nuevoIndice;
      do {
        nuevoIndice = Math.floor(Math.random() * verbos.length);
      } while (nuevoIndice === indiceActual);
      setIndiceActual(nuevoIndice);
    }
  };

  const verboActual = verbos[indiceActual];

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" p={2}>
      <Box width="100%" maxWidth={800}>
        <Typography variant="h4" align="center" mb={3} fontWeight="bold" color="primary">
          Aprende Verbos en Inglés
        </Typography>

        <Box textAlign="center" mb={3}>
          <input
            accept=".xlsx, .xls"
            type="file"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="upload-file"
          />
          <label htmlFor="upload-file">
            <Button variant="contained" component="span">
              Cargar Excel
            </Button>
          </label>
        </Box>

        {verboActual && (
          <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" align="center" gutterBottom>
              <strong>{verboActual.espanol}</strong>
            </Typography>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center"><strong>Presente</strong></TableCell>
                    <TableCell align="center"><strong>Pasado</strong></TableCell>
                    <TableCell align="center"><strong>Participio</strong></TableCell>
                    <TableCell align="center"><strong>Continuo</strong></TableCell>
                    <TableCell align="center"><strong>Futuro</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center">{verboActual.presente}</TableCell>
                    <TableCell align="center">{verboActual.pasado}</TableCell>
                    <TableCell align="center">{verboActual.participio}</TableCell>
                    <TableCell align="center">{verboActual.continuo}</TableCell>
                    <TableCell align="center">{verboActual.futuro}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>

            <Box mt={3} textAlign="center">
              <Button variant="outlined" onClick={cambiarPalabra}>
                Cambiar palabra
              </Button>
            </Box>
          </Paper>
        )}

        {!verboActual && (
          <Typography align="center" mt={4} color="text.secondary">
            Carga un archivo para comenzar.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
