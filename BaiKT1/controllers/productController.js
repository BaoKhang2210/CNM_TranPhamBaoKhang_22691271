const Product = require('../models/productModel');
const { v4: uuidv4 } = require('uuid');

exports.index = async (req, res) => {
    const keyword = req.query.keyword || "";
    const data = await Product.getAll();

    let products = data.Items || [];

    if (keyword) {
        products = products.filter(p =>
            p.name.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    res.render('products/index', { products, keyword });
};

exports.createForm = (req, res) => {
    res.render('products/create');
};

exports.create = async (req, res) => {
    const product = {
        id: uuidv4(),
        name: req.body.name,
        price: Number(req.body.price),
        unit_in_stock: Number(req.body.unit_in_stock),
        url_image: req.file ? '/uploads/' + req.file.filename : ''
    };

    await Product.create(product);
    res.redirect('/');
};

exports.detail = async (req, res) => {
    const data = await Product.getById(req.params.id);
    res.render('products/detail', { product: data.Item });
};

exports.editForm = async (req, res) => {
    const data = await Product.getById(req.params.id);
    res.render('products/edit', { product: data.Item });
};

exports.update = async (req, res) => {
    let url = req.body.oldImage;

    if (req.file) {
        url = '/uploads/' + req.file.filename;
    }

    await Product.update(req.params.id, {
        name: req.body.name,
        price: req.body.price,
        unit_in_stock: req.body.unit_in_stock,
        url_image: url
    });

    res.redirect('/');
};

exports.delete = async (req, res) => {
    await Product.delete(req.params.id);
    res.redirect('/');
};