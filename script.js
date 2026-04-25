// Add your permanent books here
let books = JSON.parse(localStorage.getItem('visualLibData')) || [
    { title: "Neural Data Science", url: "https://neuraldatascience.io", progress: 0, color: '#34495e' },
    { title: "Python Data Handbook", url: "https://github.io", progress: 0, color: '#c0392b' }
];

let currentIndex = null;

function save() {
    localStorage.setItem('visualLibData', JSON.stringify(books));
    renderBooks();
}

function addNewBook() {
    const t = document.getElementById('book-title').value;
    const u = document.getElementById('book-url').value;
    const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e67e22', '#e74c3c'];
    if (t && u) {
        books.push({ title: t, url: u, progress: 0, color: colors[Math.floor(Math.random()*colors.length)] });
        document.getElementById('book-title').value = ''; document.getElementById('book-url').value = '';
        save();
    }
}

function renderBooks() {
    const grid = document.getElementById('bookshelf');
    const query = document.getElementById('search-input').value.toLowerCase();
    grid.innerHTML = '';
    
    let finishedCount = 0;
    books.forEach((book, i) => {
        if (!book.title.toLowerCase().includes(query)) return;
        if (parseInt(book.progress) === 100) finishedCount++;

        const card = document.createElement('div');
        card.className = 'book-item';
        card.onclick = () => openReader(i);
        card.innerHTML = `
            <div class="cover-art" style="background: ${book.color}">
                <button class="delete-btn" onclick="deleteBook(${i}, event)">✕</button>
                <h3>${book.title}</h3>
                <div class="progress-bar-small">
                    <div class="progress-inner" style="width: ${book.progress}%"></div>
                </div>
            </div>
            <p style="font-size:0.8rem; margin-top:8px">${book.progress}% Done</p>
        `;
        grid.appendChild(card);
    });

    document.getElementById('total-books').innerText = books.length;
    document.getElementById('finished-books').innerText = finishedCount;
}

function openReader(idx) {
    currentIndex = idx;
    const b = books[idx];
    document.getElementById('current-book-title').innerText = b.title;
    document.getElementById('book-frame').src = b.url;
    document.getElementById('reader-progress').value = b.progress;
    document.getElementById('reader-overlay').classList.remove('hidden');
}

function closeReader() {
    books[currentIndex].progress = document.getElementById('reader-progress').value;
    document.getElementById('reader-overlay').classList.add('hidden');
    document.getElementById('book-frame').src = '';
    save();
}

function deleteBook(idx, e) {
    e.stopPropagation();
    if(confirm("Remove this book?")) {
        books.splice(idx, 1);
        save();
    }
}

renderBooks();
