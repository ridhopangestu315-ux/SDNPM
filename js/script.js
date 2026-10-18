const jadwal = [
    { hari: 'MINGGU', petugas: [], libur: true },
    { hari: 'SENIN', petugas: ['ELI HIDAYAH, S.Pd.I', 'DIKA AFRIANDI'] },
    { hari: 'SELASA', petugas: ['NGESTI RAHAYU, S.Pd.', 'YUNI WIJI LESTARI, S.Pd.'] },
    { hari: 'RABU', petugas: ['WIYONO, S.Pd', 'SAWINEM, S.Pd.SD'] },
    { hari: 'KAMIS', petugas: ['ACEP SALMAN ALPARISI, S.Pd.', 'CAHYATI TRI SUSANTI, S.Pd.'] },
    { hari: "JUM'AT", petugas: ['SUPRIYANTO', 'YENI SANTIKA SARI'] },
    { hari: 'SABTU', petugas: ['DIKA AFRIANDI', 'SUPRIYANTO'] },
];
function renderJadwalList() {
    const wrap = document.getElementById('jadwal-list');
    wrap.innerHTML = jadwal
        .filter(d => !d.libur)
        .map(d => `
            <div class="piket-card bg-white rounded-2xl p-5 shadow-sm border-t-4 border-t-red-600 uppercase">
                <div class="flex justify-between items-center mb-3 text-red-600">
                    <span class="font-black text-lg">${d.hari}</span>
                    <i class="fa-solid fa-calendar-day opacity-20"></i>
                </div>
                <ul class="space-y-1.5 font-bold text-gray-700 text-sm normal-case">
                    ${d.petugas.map(p => `<li>${p}</li>`).join('')}
                </ul>
            </div>
        `).join('');
}
function renderTodayCard() {
    const now = new Date();
    const idx = now.getDay();
    const today = jadwal[idx];
    document.getElementById('hari-ini-label').textContent =
        now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    const wrap = document.getElementById('today-card-wrapper');
    if (today.libur) {
        wrap.innerHTML = `
            <div class="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-t-gray-300 text-center">
                <i class="fa-solid fa-mug-hot text-3xl text-gray-300 mb-3"></i>
                <p class="font-extrabold text-gray-500 uppercase text-sm">Hari Libur</p>
                <p class="text-gray-400 text-xs mt-1">Tidak ada jadwal piket hari ini</p>
            </div>`;
        return;
    }
    wrap.innerHTML = `
        <div class="piket-card bg-white rounded-2xl p-6 shadow-sm border-t-4 border-t-red-600">
            <div class="flex justify-between items-center mb-4 text-red-600">
                <span class="font-black text-2xl uppercase">${today.hari}</span>
                <span class="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-1 rounded-full">Sekarang</span>
            </div>
            <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Petugas Piket</p>
            <ul class="space-y-2 font-bold text-gray-800 text-base">
                ${today.petugas.map(p => `
                    <li class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs">
                            <i class="fa-solid fa-user"></i>
                        </span>
                        ${p}
                    </li>`).join('')}
            </ul>
        </div>`;
}
function goToPage(name) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-' + name).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.nav-btn[data-goto="' + name + '"]').forEach(b => b.classList.add('active'));
    document.querySelector('main').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'auto' });
}
document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => goToPage(el.getAttribute('data-goto')));
});
function updateDateTime() {
    const now = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    document.getElementById('current-date-header').innerText = now.toLocaleDateString('id-ID', dateOptions);
    document.getElementById('current-time').innerText = now.toLocaleTimeString('id-ID');
}
setInterval(updateDateTime, 1000);
updateDateTime();
renderJadwalList();
renderTodayCard();
document.getElementById('tanggalLapor').valueAsDate = new Date();
const scriptURL = 'https://script.google.com/macros/s/AKfycbwxLg7985c7KjwKqo_90kiOdXSMF4eNDU2llwQn3Crb9W1rH6Nh-D09xJTjLQdStk-I/exec';
const form = document.getElementById('reportForm');
const btn = document.getElementById('btnSubmit');

form.addEventListener('submit', e => {
    e.preventDefault();
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';
    const data = {
        nama: document.getElementById('namaGuru').value,
        tanggal: document.getElementById('tanggalLapor').value,
        kejadian: document.getElementById('kejadianPenting').value
    };
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(data)
    })
    .then(() => {
        alert('Laporan BERHASIL dikirim ke Google Sheets!');
        form.reset();
        document.getElementById('tanggalLapor').valueAsDate = new Date();
    })
    .catch(error => {
        console.error('Error!', error.message);
        alert('Gagal mengirim laporan. Periksa koneksi atau URL Script.');
    })
    .finally(() => {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Kirim Laporan';
    });
});

