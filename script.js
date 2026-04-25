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
    shelf.innerHTML = '';

    books.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'book-card';
        card.style.backgroundColor = book.color;
        card.onclick = () => openReader(index);
        
        card.innerHTML = `
            <button class="delete-btn" onclick="deleteBook(${index}, event)">DEL</button>
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
}

// Initial Run
renderBooks();
