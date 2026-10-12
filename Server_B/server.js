const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const db = require('./db');
const { decryptData } = require('./cryptoHelper');

const app = express();
const PORT = 3002;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Receives raw encrypted data and inserts directly into local DB without decrypting
app.post('/receive', async (req, res) => {
  try {
    const dataList = Array.isArray(req.body) ? req.body : [req.body];

    const insertQuery = 'INSERT INTO produk (id, nama_produk, harga_produk, foto_produk, id_kategori) VALUES (?, ?, ?, ?, ?)';

    for (const item of dataList) {
      await db.execute(insertQuery, [
        item.id,
        item.nama_produk,
        item.harga_produk,
        item.foto_produk,
        item.id_kategori
      ]);
    }

    return res.status(200).json({
      success: true,
      message: 'Encrypted data received and stored in database'
    });
  } catch (error) {
    console.error('Error inserting data into DB:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to receive and store data',
      error: error.message
    });
  }
});

app.get('/endpoint/data', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produk');

    const decryptedData = rows.map((row) => ({
      id: row.id,
      nama_produk: decryptData(row.nama_produk),
      harga_produk: decryptData(row.harga_produk),
      foto_produk: decryptData(row.foto_produk),
      id_kategori: decryptData(row.id_kategori)
    }));

    return res.status(200).json(decryptedData);
  } catch (error) {
    console.error('Error retrieving data from DB:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve data',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server B is running on http://localhost:${PORT}`);
});
