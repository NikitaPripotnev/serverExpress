const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');

const newFood = (name, text, cal, prot, carb, fat) => ({
  id: String(Math.random()
    .toString(16)
    .split('.')[1]),
  name,
  cal,
  prot,
  carb,
  fat,
  text,
  isCompleted: false,
});

// router.use('/:id', (req, res, next) => {
//   const food = db.get('food')
//     .find({ id: req.params.id })
//     .value();
//
//   if (!food) {
//     next(new Error('CAN_NOT_FIND_food'));
//   }
// });

// GET /food
router.get('/', (req, res) => {
  const food = db.get('food').value();
  console.log('get food');
  res.json({ status: 'OK', data: food });
});

/*
// GET /food/:id
router.get('/:id', (req, res) => {
  const food = db
    .get('food')
    .find({ id: req.params.id })
    .value();

  res.json({ status: 'OK', data: food });
});
*/
// GET /food/:name
router.get('/:name', (req, res) => {
  const food = db
    .get('food')
    .find({ name: req.params.name })
    .value();
  const foodmass = { food };

  res.json({ status: food ? 'OK' : 'BAD_REQUEST', data: foodmass });
});

// POST /food
router.post('/', (req, res, next) => {
  // const requestBodySchema = {
  //   id: 'path-food',
  //   type: 'object',
  //   properties: { text: { type: 'string' } },
  //   required: ['text'],
  //   additionalProperties: false,
  // };
  //
  // if (!validate(req.body, requestBodySchema).valid) {
  //   next(new Error('INVALID_API_FORMAT'));
  // }

  const food = newFood(req.body.text);

  console.log(food);

  db
    .get('food')
    .push(food)
    .write();

  res.json({ status: 'OK', data: food });
});

// PATCH /food/:id
router.patch('/:id', (req, res, next) => {
  // const requestBodySchema = {
  //   id: 'path-food',
  //   type: 'object',
  //   properties: {
  //     text: { type: 'string' },
  //     isCompleted: { type: 'boolean' },
  //   },
  //   additionalProperties: false,
  //   minProperties: 1,
  // };
  //
  // if (!validate(req.body, requestBodySchema).valid) {
  //   next(new Error('INVALID_API_FORMAT'));
  // }

  const food = db
    .get('food')
    .find({ id: req.params.id })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK', data: food });
});

// DELETE /food/:id
router.delete('/:id', (req, res) => {
  const foodItem = db
    .get('food')
    .find({ id: req.params.id });

  db
    .get('diet')
    .forEach(item => {
      item.food.splice(item.food.indexOf(foodItem.value()), 1);
    })
    .write();

  db
    .get('food')
    .remove(foodItem)
    .write();

  res.json({ status: 'OK' });
});

module.exports = router;
