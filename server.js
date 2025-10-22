//importo las dependencias (librerias)
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

//configuro el servidor

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

//conecto a la base de datos (sino esta la crea)

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log('Conectado a SQLite');
  }
});

db.run(`CREATE TABLE IF NOT EXISTS reservas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  ciclo TEXT,
  grado TEXT,
  curso TEXT,
  hora TEXT
)`);

app.post('/reservar', (req, res) => {
  const { nombre, ciclo, grado, curso, hora } = req.body;

  if (!nombre || !ciclo || !grado || !curso || !hora) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const query = `INSERT INTO reservas (nombre, ciclo, grado, curso, hora) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [nombre, ciclo, grado, curso, hora], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ mensaje: 'Reserva guardada', id: this.lastID });
  });
});

app.get('/horas', (req, res) => {
  const { ciclo, grado, curso } = req.query;

  const query = `SELECT hora FROM reservas WHERE ciclo = ? AND grado = ? AND curso = ?`;
  db.all(query, [ciclo, grado, curso], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(row => row.hora));
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://192.168.1.112:${PORT}`);
});


