const Book = require("../models/book");
const Author = require("../models/author");
const Genre = require("../models/genre");
const BookInstance = require("../models/bookinstance");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
	const [numBooks, numBookInstances, numAvailableBookInstances, numAuthors, numGenres] =
		await Promise.all([
			Book.countDocuments({}).exec(),
			BookInstance.countDocuments({}).exec(),
			BookInstance.countDocuments({ status: "Available" }).exec(),
			Author.countDocuments({}).exec(),
			Genre.countDocuments({}).exec(),
		]);

	res.render("index", {
		title: "Local Library Home",
		book_count: numBooks,
		book_instance_count: numBookInstances,
		book_instance_available_count: numAvailableBookInstances,
		author_count: numAuthors,
		genre_count: numGenres,
	});
});

exports.book_list = asyncHandler(async (req, res, next) => {
	const allBooks = await Book.find({}, "title author").sort({ title: 1 }).populate("author").exec();
	res.render("book_list", { title: "Book List", book_list: allBooks });
});

exports.book_detail = asyncHandler(async (req, res, next) => {
	const [book, bookInstances] = await Promise.all([
		Book.findById(req.params.id).populate("author").populate("genre").exec(),
		BookInstance.find({ book: req.params.id }).exec(),
	]);

	if (book === null) {
		// No results.
		const err = new Error("Book not found");
		err.status = 404;
		return next(err);
	}

	res.render("book_detail", {
		title: book.title,
		book: book,
		book_instances: bookInstances,
	});
});

exports.book_create_get = asyncHandler(async (req, res, next) => {
	const [allAuthors, allGenres] = await Promise.all([Author.find().exec(), Genre.find().exec()]);

	res.render("book_form", {
		title: "Create Book",
		authors: allAuthors,
		genres: allGenres,
	});
});

exports.book_create_post = [
	(req, res, next) => {
		if (!(req.body.genre instanceof Array)) {
			if (typeof req.body.genre === "undefined") req.body.genre = [];
			else req.body.genre = new Array(req.body.genre);
		}
		next();
	},

	body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("author", "Author must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("summary", "Summary must not be empty.").trim().isLength({ min: 1 }).escape(),
	body("isbn", "ISBN must not be empty").trim().isLength({ min: 1 }).escape(),
	body("genre.*").escape(),

	asyncHandler(async (req, res, next) => {
		const errors = validationResult(req);

		const book = new Book({
			title: req.body.title,
			author: req.body.author,
			summary: req.body.summary,
			isbn: req.body.isbn,
			genre: req.body.genre,
		});

		if (!errors.isEmpty()) {
			const [allAuthors, allGenres] = await Promise.all([
				Author.find().exec(),
				Genre.find().exec(),
			]);

			for (const genre of allGenres) {
				if (book.genre.includes(genre._id)) {
					genre.checked = "true";
				}
			}
			res.render("book_form", {
				title: "Create Book",
				authors: allAuthors,
				genres: allGenres,
				book: book,
				errors: errors.array(),
			});
		} else {
			await book.save();
			res.redirect(book.url);
		}
	}),
];

exports.book_delete_get = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Book delete GET `);
});

exports.book_delete_post = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Book delete POST `);
});

exports.book_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book update GET");
});

exports.book_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Book update POST");
});
