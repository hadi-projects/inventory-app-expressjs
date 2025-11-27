const Inventory = require('../models/Inventory');

exports.getAllItems = async (req, res) => {
  try {
    let items = await Inventory.getAll();
    
    // <CHANGE> Tambahkan fitur pencarian
    const searchQuery = req.query.search || '';
    if (searchQuery) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // <CHANGE> Hitung statistik untuk dashboard
    const totalItems = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const averagePrice = totalItems > 0 ? (items.reduce((sum, item) => sum + item.price, 0) / totalItems).toFixed(2) : 0;
    
    // <CHANGE> Hitung statistik per kategori untuk chart
    const categoryStats = {};
    items.forEach(item => {
      const category = item.category || 'Uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = { quantity: 0, value: 0 };
      }
      categoryStats[category].quantity += item.quantity;
      categoryStats[category].value += item.quantity * item.price;
    });

    const stats = {
      totalItems,
      totalQuantity,
      totalValue: totalValue.toFixed(2),
      averagePrice,
      categoryStats,
      categoryLabels: Object.keys(categoryStats),
      categoryQuantities: Object.values(categoryStats).map(cat => cat.quantity),
      categoryValues: Object.values(categoryStats).map(cat => cat.value.toFixed(2))
    };

    res.render('index', { items, searchQuery, stats });
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