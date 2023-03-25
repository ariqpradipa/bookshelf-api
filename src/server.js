import express from 'express';
import { nanoid } from 'nanoid';

const app = express();
const port = 9000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

        console.log(theBook);

        res.status(201).json({ status: 'success', message: 'Buku berhasil ditambahkan', data: { bookId: theBook.id } });

    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
});

app.listen(port, () => {

    console.log(`Bookshelf API listening at PORT ${port}`);

});
