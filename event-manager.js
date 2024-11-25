import { db } from './firebase-config.js';

export async function loadEvents() {
    try {
        const snapshot = await db.collection('events').orderBy('createdAt', 'desc').get();
        const events = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        events.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        const eventList = document.getElementById('eventList');
        const eventCount = document.getElementById('eventCount');
        
        if (events.length === 0) {
            eventList.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <i class="fas fa-calendar-times text-gray-400 text-5xl mb-4"></i>
                    <p class="text-gray-500 text-lg">Belum ada event yang ditambahkan</p>
                    <button onclick="document.getElementById('addEventBtn').click()" 
                            class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Tambah Event Pertama
                    </button>
                </div>
            `;
        } else {
            eventList.innerHTML = events.map(event => {
                const escapedName = event.name.replace(/"/g, '&quot;');
                const escapedDesc = (event.description || '').replace(/"/g, '&quot;');
                const formattedDate = event.createdAt ? 
                    new Date(event.createdAt.seconds * 1000).toLocaleDateString() : 
                    'Tanggal tidak tersedia';

                return `
                    <div class="bg-white rounded-lg shadow-lg p-6 relative hover:shadow-xl transition-all duration-200 border border-gray-100">
                        <div class="flex justify-between items-start mb-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-800">${escapedName}</h3>
                                <p class="text-gray-600 mt-2">${escapedDesc || 'Tidak ada deskripsi'}</p>
                            </div>
                            <div class="flex gap-2">
                                <button onclick="editEvent('${event.id}', '${escapedName}', '${escapedDesc}')" 
                                    class="text-green-500 hover:text-green-600">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button onclick="deleteEvent('${event.id}')" 
                                    class="text-red-500 hover:text-red-600">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <p class="text-sm text-gray-500 mb-4">
                            <i class="far fa-clock mr-2"></i>
                            Dibuat pada: ${formattedDate}
                        </p>
                        <button onclick="openGanttChart('${event.id}')" 
                            class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                            <i class="fas fa-chart-gantt mr-2"></i>
                            Gantt Chart
                        </button>
                    </div>
                `;
            }).join('');
        }
        
        eventCount.textContent = events.length;
        return true;
    } catch (error) {
        console.error('Error loading events:', error);
        throw error;
    }
}

export async function addEvent(eventData) {
    try {
        await db.collection('events').add({
            ...eventData,
            createdAt: new Date()
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Event baru berhasil ditambahkan',
            timer: 1500,
            showConfirmButton: false
        });
        
        return true;
    } catch (error) {
        console.error("Error adding event:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal menambahkan event: ' + error.message
        });
        return false;
    }
}

export async function deleteEvent(eventId) {
    const result = await Swal.fire({
        title: 'Hapus Event?',
        text: 'Anda yakin ingin menghapus event ini? Semua data terkait akan terhapus.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            await db.collection('events').doc(eventId).delete();
            Swal.fire('Terhapus!', 'Event berhasil dihapus.', 'success');
            loadEvents();
        } catch (error) {
            handleError(error, 'Gagal menghapus event');
        }
    }
}

export async function editEvent(eventId, currentName, currentDesc) {
    const { value: formValues } = await Swal.fire({
        title: 'Edit Event',
        html: `
            <input id="swal-name" class="swal2-input" placeholder="Nama Event" value="${currentName}">
            <textarea id="swal-desc" class="swal2-textarea" placeholder="Deskripsi">${currentDesc}</textarea>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        preConfirm: validateEventForm
    });

    if (formValues) {
        await updateEvent(eventId, formValues);
    }
}

function validateEventForm() {
    const name = document.getElementById('swal-name').value;
    const description = document.getElementById('swal-desc').value;
    if (!name.trim()) {
        Swal.showValidationMessage('Nama event tidak boleh kosong');
        return false;
    }
    return { name, description }
}

async function updateEvent(eventId, formValues) {
    try {
        await db.collection('events').doc(eventId).update({
            name: formValues.name,
            description: formValues.description
        });
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'Event berhasil diperbarui',
            timer: 1500,
            showConfirmButton: false
        });
        
        loadEvents();
    } catch (error) {
        console.error("Error updating event:", error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal memperbarui event'
        });
    }
}

function renderEmptyState(eventList) {
    eventList.innerHTML = `
        <div class="col-span-3 text-center py-12">
            <i class="fas fa-calendar-plus text-gray-400 text-5xl mb-4"></i>
            <p class="text-gray-500 text-lg">Belum ada event yang dibuat</p>
            <button onclick="document.getElementById('addEventBtn').click()" 
                    class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Tambah Event Pertama
            </button>
        </div>
    `;
}

function renderEvents(snapshot) {
    const eventList = document.getElementById('eventList');
    eventList.innerHTML = '';
    
    snapshot.forEach(event => {
        const card = createEventCard(event.id, event);
        eventList.appendChild(card);
    });
}

function createEventCard(id, event) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg p-6 relative hover:shadow-xl transition-all duration-200 border border-gray-100';
    
    const escapedName = event.name.replace(/"/g, '&quot;');
    const escapedDesc = (event.description || '').replace(/"/g, '&quot;');
    
    const formattedDate = event.createdAt && event.createdAt.toDate ? 
        event.createdAt.toDate().toLocaleDateString() : 
        'Tanggal tidak tersedia';

    card.innerHTML = `
        <div class="flex justify-between items-start mb-4">
            <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-800">${escapedName}</h3>
                <p class="text-gray-600 mt-2">${escapedDesc || 'Tidak ada deskripsi'}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="editEvent('${id}', '${escapedName}', '${escapedDesc}')" 
                    class="text-green-500 hover:text-green-600">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteEvent('${id}')" 
                    class="text-red-500 hover:text-red-600">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        <p class="text-sm text-gray-500 mb-4">
            <i class="far fa-clock mr-2"></i>
            Dibuat pada: ${formattedDate}
        </p>
        <button onclick="openGanttChart('${id}')" 
            class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            <i class="fas fa-chart-gantt mr-2"></i>
            Gantt Chart
        </button>
    `;
    return card;
}

function handleError(error, message = 'Gagal memuat data event') {
    console.error("Error:", error);
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

export function searchEvents(query) {
    const eventList = document.getElementById('eventList');
    const noResults = document.getElementById('noResults');
    
    if (!query.trim()) {
        noResults.classList.add('hidden');
        loadEvents();
        return;
    }

    try {
        db.collection('events')
            .orderBy('createdAt', 'desc')
            .get()
            .then((snapshot) => {
                const events = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                const filteredEvents = events.filter(event => 
                    event.name.toLowerCase().includes(query.toLowerCase()) ||
                    (event.description && event.description.toLowerCase().includes(query.toLowerCase()))
                );

                filteredEvents.sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                if (filteredEvents.length === 0) {
                    eventList.innerHTML = '';
                    noResults.classList.remove('hidden');
                } else {
                    noResults.classList.add('hidden');
                    eventList.innerHTML = filteredEvents.map(event => {
                        const escapedName = event.name.replace(/"/g, '&quot;');
                        const escapedDesc = (event.description || '').replace(/"/g, '&quot;');
                        const formattedDate = event.createdAt ? 
                            new Date(event.createdAt.seconds * 1000).toLocaleDateString() : 
                            'Tanggal tidak tersedia';

                        return `
                            <div class="bg-white rounded-lg shadow-lg p-6 relative hover:shadow-xl transition-all duration-200 border border-gray-100">
                                <div class="flex justify-between items-start mb-4">
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-gray-800">${escapedName}</h3>
                                        <p class="text-gray-600 mt-2">${escapedDesc || 'Tidak ada deskripsi'}</p>
                                    </div>
                                    <div class="flex gap-2">
                                        <button onclick="editEvent('${event.id}', '${escapedName}', '${escapedDesc}')" 
                                            class="text-green-500 hover:text-green-600">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button onclick="deleteEvent('${event.id}')" 
                                            class="text-red-500 hover:text-red-600">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                <p class="text-sm text-gray-500 mb-4">
                                    <i class="far fa-clock mr-2"></i>
                                    Dibuat pada: ${formattedDate}
                                </p>
                                <button onclick="openGanttChart('${event.id}')" 
                                    class="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                                    <i class="fas fa-chart-gantt mr-2"></i>
                                    Gantt Chart
                                </button>
                            </div>
                        `;
                    }).join('');
                }
            });
    } catch (error) {
        console.error('Error searching events:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Gagal mencari event'
        });
    }
} 