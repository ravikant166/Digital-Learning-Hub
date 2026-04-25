// Data persistence
let books = JSON.parse(localStorage.getItem('myBookshelf')) || [
    { title: "Neural Data Science", url: "https://neuraldatascience.io", progress: 0, color: '#2c3e50' },
    { title: "Python Data Science", url: "https://github.io", progress: 0, color: '#c0392b' }
];

let activeBookIndex = null;

function saveAndRender() {
    localStorage.setItem('myBookshelf', JSON.stringify(books));
    renderBooks();
}

function addNewBook() {
    const title = document.getElementById('book-title').value;
    const url = document.getElementById('book-url').value;
    const colors = ['#8e44ad', '#c0392b', '#27ae60', '#2980b9', '#f39c12', '#2c3e50', '#d35400'];
    
    if (title && url) {
        books.push({
            title: title,
            url: url,
            progress: 0,
            color: colors[Math.floor(Math.random() * colors.length)]
        });
        saveAndRender();
        document.getElementById('book-title').value = '';
        document.getElementById('book-url').value = '';
    }
}

function deleteBook(index, e) {
    e.stopPropagation();
    books.splice(index, 1);
    saveAndRender();
}

function openReader(index) {
    activeBookIndex = index;
    const book = books[index];
    document.getElementById('current-book-title').innerText = book.title;
    document.getElementById('book-frame').src = book.url;
    document.getElementById('reader-progress-input').value = book.progress;
    document.getElementById('reader-overlay').classList.remove('hidden');
}

function closeReader() {
    // Save progress from the input before closing
    const newProg = document.getElementById('reader-progress-input').value;
    books[activeBookIndex].progress = newProg;
    
    document.getElementById('reader-overlay').classList.add('hidden');
    document.getElementById('book-frame').src = '';
    saveAndRender();
}

function renderBooks() {
    const shelf = document.getElementById('bookshelf');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    shelf.innerHTML = '';

    // Filter books based on search term
    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm)
    );

    // Use filteredBooks for the display loop
    filteredBooks.forEach((book) => {
        // We need the original index for deleting/opening
        const originalIndex = books.indexOf(book); 
        
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.backgroundColor = book.color;
        card.onclick = () => openReader(originalIndex);
        
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteBook(${originalIndex}, event)">DEL</button>
            <h3>${book.title}</h3>
            <div>
                <center><small>${book.progress}%</small></center>
                <div class="progress-spine">
                    <div class="progress-fill" style="width: ${book.progress}%"></div>
                </div>
            </div>
        `;
        shelf.appendChild(card);
    });

    // Show a message if no books match
    if (filteredBooks.length === 0 && searchTerm !== "") {
        shelf.innerHTML = `<p style="color: white; width: 100%; text-align: center;">No books found matching "${searchTerm}"</p>`;
    }

    // New function to update the dashboard numbers
function updateStats() {
    const total = books.length;
    const finished = books.filter(b => parseInt(b.progress) === 100).length;
    const inProgress = books.filter(b => parseInt(b.progress) > 0 && parseInt(b.progress) < 100).length;

    document.getElementById('total-books').innerText = total;
    document.getElementById('in-progress-books').innerText = inProgress;
    document.getElementById('finished-books').innerText = finished;
}

// Update your existing renderBooks function to call updateStats()
function renderBooks() {
    const shelf = document.getElementById('bookshelf');
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    shelf.innerHTML = '';

    // First, update the dashboard numbers
    updateStats();

    const filteredBooks = books.filter(book => 
        book.title.toLowerCase().includes(searchTerm)
    );

    filteredBooks.forEach((book) => {
        const originalIndex = books.indexOf(book); 
        const card = document.createElement('div');
        card.className = 'book-card';
        
        // Add a "Finished" ribbon if 100%
        const isFinished = parseInt(book.progress) === 100;
        card.style.backgroundColor = isFinished ? '#4CAF50' : (book.color || '#2c3e50');
        
        card.onclick = () => openReader(originalIndex);
        
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteBook(${originalIndex}, event)">DEL</button>
            <h3>${book.title} ${isFinished ? '✅' : ''}</h3>
            <div>
                <center><small>${book.progress}%</small></center>
                <div class="progress-spine">
                    <div class="progress-fill" style="width: ${book.progress}%"></div>
                </div>
            </div>
        `;
        shelf.appendChild(card);
    });
}

}

// Initial Run
renderBooks();
