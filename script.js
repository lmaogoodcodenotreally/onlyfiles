const DB_URL = 'https://pillowcase.su/onlyfiles.txt';
const fileTable = document.getElementById('file-table');
const fileList = document.getElementById('file-list');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');

let files = [];
let sortedBy = 'name';
let sortOrder = 'asc';
let currentPage = 1;

function fetchData() {
    fetch(DB_URL)
        .then(response => response.text())
        .then(data => {
            files = data.split('\n').map(line => {
                const [filename, size, link] = line.split(' - ');
                return { filename, size, link };
            });
            renderFiles();
            updatePageInfo();
        });
}

fetchData();

searchBtn.addEventListener('click', searchFiles);

fileTable.addEventListener('click', e => {
    if (e.target.tagName === 'TH') {
        const header = e.target.id;
        if (header === 'name-header') {
            sortedBy = 'name';
        } else if (header === 'size-header') {
            sortedBy = 'size';
        }
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        renderFiles();
        updatePageInfo();
    }
});

function renderFiles() {
    fileList.innerHTML = '';
    const start = (currentPage - 1) * 100;
    const end = start + 100;
    files.sort((a, b) => {
        if (sortedBy === 'name') {
            if (sortOrder === 'asc') {
                return a.filename.localeCompare(b.filename);
            } else {
                return b.filename.localeCompare(a.filename);
            }
        } else if (sortedBy === 'size') {
            if (sortOrder === 'asc') {
                return parseInt(a.size.replace(' MB', '')) - parseInt(b.size.replace(' MB', ''));
            } else {
                return parseInt(b.size.replace(' MB', '')) - parseInt(a.size.replace(' MB', ''));
            }
        }
    }).slice(start, end).forEach(file => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${file.filename}</td>
            <td>${file.size}</td>
            <td><a href="${file.link}" target="_blank">${file.link}</a></td>
        `;
        fileList.appendChild(row);
    });
}

function searchFiles() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    files = files.filter(file => file.filename.toLowerCase().includes(searchTerm));
    renderFiles();
    updatePageInfo();
}

function updatePageInfo() {
    currentPage = Math.ceil(files.length / 100);
    totalPagesSpan.textContent = `/ ${currentPage}`;
    currentPageSpan.textContent = currentPage;
}
