// Mengambil elemen DOM
const itemForm = document.getElementById('itemForm');
const itemList = document.getElementById('itemList');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');

// Mengambil data dari LocalStorage atau membuat array contoh jika masih kosong
let items = JSON.parse(localStorage.getItem('lostAndFoundItems')) || [
    {
        id: 1,
        status: 'Hilang',
        itemName: 'Flashdisk SanDisk 32GB',
        location: 'Lab Komputer 2',
        date: '2026-11-16',
        contact: '0812-3456-7890 (Andi)',
        description: 'Warna hitam merah, ada gantungan kunci tali biru.'
    },
    {
        id: 2,
        status: 'Ditemukan',
        itemName: 'Botol Minum Tupperware',
        location: 'Lapangan Upacara',
        date: '2026-11-17',
        contact: '0898-7654-3210 (Ruang Piket)',
        description: 'Warna hijau botol ukuran 1 liter, tertinggal di pinggir lapangan.'
    }
];

// Fungsi menyimpan ke LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('lostAndFoundItems', JSON.stringify(items));
}

// Fungsi menampilkan daftar barang
function renderItems() {
    const searchText = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;

    itemList.innerHTML = '';

    const filteredItems = items.filter(item => {
        const matchesSearch = item.itemName.toLowerCase().includes(searchText) || 
                              item.location.toLowerCase().includes(searchText);
        const matchesStatus = statusFilter === 'Semua' || item.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filteredItems.length === 0) {
        itemList.innerHTML = '<p>Tidak ada laporan barang yang sesuai.</p>';
        return;
    }

    filteredItems.forEach(item => {
        const statusClass = item.status.toLowerCase();
        const card = document.createElement('div');
        card.className = `card ${statusClass}`;

        card.innerHTML = `
            <div>
                <span class="badge ${statusClass}">${item.status.toUpperCase()}</span>
                <h3>${item.itemName}</h3>
                <p><strong>Lokasi:</strong> ${item.location}</p>
                <p><strong>Tanggal:</strong> ${item.date}</p>
                <p><strong>Ciri-ciri:</strong> ${item.description}</p>
                <p><strong>Kontak:</strong> ${item.contact}</p>
            </div>
            <button class="btn-delete" onclick="deleteItem(${item.id})">Tandai Selesai / Hapus</button>
        `;
        itemList.appendChild(card);
    });
}

// Event saat form disubmit
itemForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const newItem = {
        id: Date.now(),
        status: document.getElementById('status').value,
        itemName: document.getElementById('itemName').value,
        location: document.getElementById('location').value,
        date: document.getElementById('date').value,
        contact: document.getElementById('contact').value,
        description: document.getElementById('description').value
    };

    items.unshift(newItem); // Tambahkan ke urutan paling atas
    saveToLocalStorage();
    renderItems();
    itemForm.reset();
});

// Fungsi menghapus barang
function deleteItem(id) {
    if (confirm('Apakah barang ini sudah ditemukan/dikembalikan dan siap dihapus dari daftar?')) {
        items = items.filter(item => item.id !== id);
        saveToLocalStorage();
        renderItems();
    }
}

// Event untuk pencarian dan filter
searchInput.addEventListener('input', renderItems);
filterStatus.addEventListener('change', renderItems);

// Tampilkan data saat halaman pertama kali dibuka
renderItems();