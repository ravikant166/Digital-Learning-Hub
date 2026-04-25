let books = JSON.parse(localStorage.getItem('myBookshelf')) || [
    { title: "Neural Data Science", url: "https://neuraldatascience.io", progress: 0, color: '#2c3e50', notes: "" },
    { title: "Python Data Science", url: "https://github.io", progress: 0, color: '#c0392b', notes: "" }
];

let activeIndex = null;

function saveAndRender() {
    localStorage.setItem('myBookshelf', JSON.stringify(books));
    renderBooks();
}

function updateStats() {
    document.getElementById('total-books').innerText = books.length;
    document.getElementById('in-progress-books').innerText = books.filter(b => b.progress > 0 && b.progress < 100).length;
    document.getElementById('finished-books').innerText = books.filter(b => parseInt(b.progress) === 100).length;
}

function addNewBook() {
    const title = document.getElementById('book-title').value;
    const url = document.getElementById('book-url').value;
    const colors = ['#8e44ad', '#c0392b', '#27ae60', '#2980b9', '#f39c12', '#2c3e50'];
    if (title && url) {
        books.push({ title, url, progress: 0, notes: "", color: colors[Math.floor(Math.random()*colors.length)] });
        saveAndRender();
        document.getElementById('book-title').value = ''; document.getElementById('book-url').value = '';
    }
}

function renderBooks() {
    const shelf = document.getElementById('bookshelf');
    const search = document.getElementById('search-input').value.toLowerCase();
    shelf.innerHTML = '';
    updateStats();

    books.forEach((book, idx) => {
        if (!book.title.toLowerCase().includes(search)) return;
        const isDone = parseInt(book.progress) === 100;
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.backgroundColor = isDone ? '#4CAF50' : book.color;
        card.onclick = () => openReader(idx);
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteBook(${idx}, event)">DEL</button>
            <h3>${book.title} ${isDone ? '✅' : ''}</h3>
            <div>
                <center><small>${book.progress}%</small></center>
                <div class="progress-spine"><div class="progress-fill" style="width:${book.progress}%"></div></div>
            </div>`;
        shelf.appendChild(card);
    });
}

function openReader(index) {
    activeIndex = index;
    const book = books[index];
    document.getElementById('current-book-title').innerText = book.title;
    document.getElementById('book-frame').src = book.url;
    document.getElementById('reader-progress-input').value = book.progress;
    document.getElementById('book-notes').value = book.notes || "";
    document.getElementById('reader-overlay').classList.remove('hidden');
}

function closeReader() {
    books[activeIndex].progress = document.getElementById('reader-progress-input').value;
    books[activeIndex].notes = document.getElementById('book-notes').value;
    document.getElementById('reader-overlay').classList.add('hidden');
    document.getElementById('book-frame').src = '';
    saveAndRender();
}

function deleteBook(index, e) { e.stopPropagation(); books.splice(index, 1); saveAndRender(); }

function exportData() {
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(books));
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'library_backup.json');
    link.click();
}

function importData(e) {
    const reader = new FileReader();
    reader.onload = (event) => {
        books = JSON.parse(event.target.result);
        saveAndRender();
    };
    reader.readAsText(e.target.files[0]);
}

renderBooks();
