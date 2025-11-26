const Inventory = require('../models/Inventory');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Inventory.getAll();
    res.render('index', { items });
  } catch (error) {
    res.status(500).render('error', { error: 'Error fetching items' });
  }
};

exports.getAddPage = (req, res) => {
  res.render('add');
};

exports.addItem = async (req, res) => {
  try {
    const { name, description, quantity, price, category } = req.body;
    
    if (!name || !quantity || !price) {
      return res.status(400).render('add', { error: 'Please fill all required fields' });
    }

    await Inventory.create({
      name,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      category
    });

    res.redirect('/');
  } catch (error) {
    res.status(500).render('add', { error: 'Error adding item' });
  }
};

exports.getEditPage = async (req, res) => {
  try {
    const item = await Inventory.getById(req.params.id);
    if (!item) {
      return res.status(404).render('error', { error: 'Item not found' });
    }
    res.render('edit', { item });
  } catch (error) {
    res.status(500).render('error', { error: 'Error loading item' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { name, description, quantity, price, category } = req.body;
    
    if (!name || !quantity || !price) {
      const item = await Inventory.getById(req.params.id);
      return res.status(400).render('edit', { item, error: 'Please fill all required fields' });
    }

    await Inventory.update(req.params.id, {
      name,
      description,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      category
    });

    res.redirect('/');
  } catch (error) {
    res.status(500).render('error', { error: 'Error updating item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await Inventory.delete(req.params.id);
    res.redirect('/');
  } catch (error) {
    res.status(500).render('error', { error: 'Error deleting item' });
  }
};