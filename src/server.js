import express from 'express';
import { nanoid } from 'nanoid';

const app = express();
const port = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allBooks = [];

app.post('/books', (req, res) => {

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

    if (!name) {

        res.status(400).json({ status: 'fail', message: 'Gagal menambahkan buku. Mohon isi nama buku' });

    } else if (Number(readPage) > Number(pageCount)) {

        res.status(400).json({ status: 'fail', message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount' });

    } else {

        const theBook = {

            "id": nanoid(),
            "name": name,
            "year": year,
            "author": author,
            "summary": summary,
            "publisher": publisher,
            "pageCount": pageCount,
            "readPage": readPage,
            "finished": readPage === pageCount,
            "reading": reading,
            "insertedAt": new Date().toISOString(),
            "updatedAt": new Date().toISOString()

        }

        allBooks.push(theBook);

        res.status(201).json({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: theBook.id } });

    }
});

app.get("/books", (req, res) => {

    const { name, reading, finished } = req.query;

    let books = allBooks;

    if (name) {

        books = books.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));

    }

    if (reading !== undefined) {

        const isReading = reading === '1';
        books = books.filter(book => book.reading === isReading);

    }

    if (finished !== undefined) {

        const isFinished = finished === '1';
        books = books.filter(book => book.finished === isFinished);

    }

    const getBooks = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
    res.status(200).json({ status: 'success', data: { books: getBooks } });

});

app.get("/books/:id", (req, res) => {

    const { id } = req.params;
    const book = allBooks.find((book) => book.id === id);

    if (book) {

        res.status(200).json({ status: 'success', data: { book } });

    } else {

        res.status(404).json({ status: 'fail', message: 'Buku tidak ditemukan' });

    }
});

app.put("/books/:id", (req, res) => {

    const { id } = req.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = req.body;

    if (!name) {

        res.status(400).json({ status: 'fail', message: 'Gagal memperbarui buku. Mohon isi nama buku' });

    } else if (Number(readPage) > Number(pageCount)) {

        res.status(400).json({ status: 'fail', message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount' });

    } else {

        const index = allBooks.findIndex((book) => book.id === id);

        if (index !== -1) {

            allBooks[index] = {
                ...allBooks[index],
                name,
                year,
                author,
                summary,
                publisher,
                pageCount,
                readPage,
                reading,
                updatedAt: new Date().toISOString()
            };

            res.status(200).json({ status: 'success', message: 'Buku berhasil diperbarui' });

        } else {

            res.status(404).json({ status: 'fail', message: 'Gagal memperbarui buku. Id tidak ditemukan' });

        }
    }
});

app.delete("/books/:id", (req, res) => {

    const { id } = req.params;
    const index = allBooks.findIndex((book) => book.id === id);

    if (index !== -1) {

        allBooks.splice(index, 1);
        res.status(200).json({ status: 'success', message: 'Buku berhasil dihapus' });

    } else {

        res.status(404).json({ status: 'fail', message: 'Buku gagal dihapus. Id tidak ditemukan' });

    }
});

app.use((err, req, res, next) => {

    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });

});

app.listen(port, () => {

    console.log(`Bookshelf API listening at PORT ${port}`);

});