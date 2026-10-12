const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const axios = require('axios');
const db = require('./db');
const { encryptData } = require('./cryptoHelper');

const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/transmit', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM produk');

    const encryptedPayload = rows.map((row) => ({
      id: row.id,
      nama_produk: encryptData(row.nama_produk),
      harga_produk: encryptData(row.harga_produk),
      foto_produk: encryptData(row.foto_produk),
      id_kategori: encryptData(row.id_kategori)
    }));

    const response = await axios.post('http://localhost:3002/receive', encryptedPayload);

    return res.status(200).json({
      success: true,
      message: 'Data successfully transmitted to Server B',
      remoteResponse: response.data,
      transmittedPayload: encryptedPayload
    });
  } catch (error) {
    console.error('Error during transmission:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Transmission failed',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server A is running on http://localhost:${PORT}`);
});
