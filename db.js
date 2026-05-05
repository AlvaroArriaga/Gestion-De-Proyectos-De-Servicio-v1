const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Programacion Web',
  password: 'DS-p4tty$_mp',
  port: 5432,
});

// Intentamos hacer una consulta simple para probar la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.stack);
  } else {
    console.log('¡Conexión exitosa a PostgreSQL!');
    console.log('Fecha y hora del servidor:', res.rows[0].now);
  }
  // Cerramos el pool para que el programa termine
  pool.end();
});