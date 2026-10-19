import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Kategori() {
  const [kategori, setkategori] = useState([]);
  const [serverStatus, setServerStatus] = useState('Memuat...');
  const [activeColor, setActiveColor] = useState('blue');

  useEffect(() => {
    const serverA = 'http://localhost:4000/api/kategori/';
    const serverB = 'http://localhost:3100/apiserverb/kategori/';

    axios.get(serverA)
      .then(res => {
        if (res.data && res.data.status) {
          setkategori(res.data.data);
          setServerStatus('Server A (Utama) - Port 4000 [ONLINE]');
          setActiveColor('green');
        }
      })
      .catch(err => {
        console.warn('Server A mati, beralih ke Server B (fallback)...');
        axios.get(serverB)
          .then(res => {
            if (res.data && res.data.status) {
              setkategori(res.data.data);
              setServerStatus('Data Server B (Fallback) sedang berjalan - Port 3100 [AKTIF]');
              setActiveColor('orange');
            }
          })
          .catch(errB => {
            console.error('Kedua server gagal:', errB);
            setkategori([]);
            setServerStatus('KEDUA SERVER GAGAL / MATI');
            setActiveColor('red');
          });
      });
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <ul>
        <li>Home</li>
        <li>Produk</li>
        <li>Kategori</li>
      </ul>

      <h2>Data kategori</h2>

      {/* Status Banner yang wajib menampilkan keterangan Server B aktif */}
      <div style={{
        padding: '10px 15px',
        margin: '15px 0',
        backgroundColor: '#f8f9fa',
        border: `2px solid ${activeColor}`,
        borderRadius: '5px',
        fontWeight: 'bold'
      }}>
        Status Sumber Data: <span style={{ color: activeColor }}>{serverStatus}</span>
      </div>

      <table border="1" cellPadding="6" cellSpacing="0" style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '700px' }}>
        <thead>
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Gambar</th>
          </tr>
        </thead>
        <tbody>
          {kategori && kategori.length > 0 ? (
            kategori.map((item, index) => (
              <tr key={item.id || index}>
                <td>{item.id || index + 1}</td>
                <td>{item.nama || item.nama_mobil || item.nama_kategori}</td>
                <td style={{ textAlign: 'center' }}>
                  {item.gambar_mobil ? (
                    <img src={item.gambar_mobil} alt={item.nama_mobil || 'mobil'} width="70" style={{ borderRadius: '4px' }} />
                  ) : '-'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', color: activeColor, padding: '15px', fontWeight: 'bold' }}>
                {serverStatus.includes('GAGAL')
                  ? '⚠️ Tidak ada data: Kedua server mati / offline'
                  : 'Memuat data...'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Kategori;
