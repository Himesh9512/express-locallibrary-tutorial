const Genre = require("../models/genre");
const asyncHandler = require("express-async-handler");

exports.genre_list = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre list");
});

exports.genre_details = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Genre list: ${req.params.id} `);
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Genre create GET `);
});

exports.author_create_post = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Genre create POST `);
});

exports.genre_delete_get = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Genre delete GET `);
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
	res.send(`NOT IMPLEMENTED: Genre delete POST `);
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre update GET");
});

exports.genre_update_post = asyncHandler(async (req, res, next) => {
	res.send("NOT IMPLEMENTED: Genre update POST");
});
