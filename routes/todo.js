const express = require('express');
const router = express.Router();

const todoController = require('../controllers/todo');

router.post('/create', todoController.create);
router.delete('/:itemId', todoController.delete);
router.put('/:itemId', todoController.update);
router.get('/', todoController.paginate);

module.exports = router;
