const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const Book = new mongoose.Schema({
    title: String,
    issue_year: Number,
    author: String,
    language: String,
});

const BookModel = mongoose.model('Book', Book);

// C
router.post('/', async (req, res) => {
    const {
        title,
        issue_year,
        author,
        language,
    } = req.body;

    const book = new BookModel({
        title,
        issue_year,
        author,
        language,
    });

    try {
        const doc = await book.save();

        res.send(doc);
    } catch(err) {
        res.send({ err: err.message })
    }
})

// R
router.get('/', async (req, res) => {
    try {
        const data = await BookModel.find({}).exec();

        res.send(data);
    } catch(err) {
        res.send({ err: err.message })
    }
})

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await BookModel.findById(id).exec();

        res.send(book);
    } catch (err) {
        res.send({ err: err.message });
    }
})

// U
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const {
        title,
        issue_year,
        author,
        language,
    } = req.body;

    const dataPayload = {
        title,
        issue_year,
        author,
        language,
    };

    for (const key in dataPayload) {
        if (!dataPayload[key]) {
            delete dataPayload[key];
        }
    }

    try {
        await BookModel.updateOne(
            { _id: id },
            {
                $set: dataPayload
            }
        ).exec();

        const book = await BookModel.findById(id);

        res.send(book);
    } catch (err) {
        res.send({ err: err.message });
    }
})

// D
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const book = await BookModel.findById(id);
        await BookModel.deleteOne({ _id: id });

        res.send({ err: null, message: 'ok', book });
    } catch (err) {
        res.send({ err: err.message });
    }
})

module.exports = router;