module.exports = {
    apps: [
      {
        name: 'sq.daarul-ilmi', // Nama aplikasi
        script: 'server.js', // Nama file utama aplikasi
        instances: 1, // Jumlah instance yang akan dijalankan
        autorestart: true, // Restart otomatis jika aplikasi berhenti
        watch: false, // Mengaktifkan mode watch untuk memantau perubahan file
        max_memory_restart: '1G', // Batas memori untuk restart
        env: {
          NODE_ENV: 'production', // Variabel lingkungan
          PORT: 3000, // Port aplikasi
        },
        env_production: {
          NODE_ENV: 'production', // Variabel lingkungan khusus produksi
          PORT: 80, // Port aplikasi untuk produksi
        },
      },
      // Aplikasi lain dapat ditambahkan disini jika diperlukan
    ],
  };
  