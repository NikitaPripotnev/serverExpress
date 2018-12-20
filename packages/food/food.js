const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');

const newFood = data => Object.assign(
  {
    id: String(Math.random()
      .toString(16)
      .split('.')[1]),
  },
  data
);

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

// GET /food/:id
router.get('/:id', (req, res, next) => {
  const food = db
    .get('food')
    .find({ id: req.params.id })
    .value();
  if (food) {
    res.json({ status: 'OK', data: food });
  } else {
    next();
  }
});

// GET /food/:name
router.get('/:name', (req, res) => {
  const food = db
    .get('food')
    .find({ name: req.params.name })
    .value();

  res.json({ status: food ? 'OK' : 'BAD_REQUEST', data: food });
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
  console.log('start post request', req.body);

  const food = newFood(req.body);

  console.log(food);

  db.get('food')
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
  db.get('diets')
    .value()
    .forEach(element => {
      const index = element.food.map(elem => elem.id).indexOf(req.params.id);
      if (index >= 0) {
        element.food.splice(index, 1);
      }
    });
  db.write();
  db.get('food')
    .remove({ id: req.params.id })
    .write();

  res.json({ status: 'OK' });
});

module.exports = router;
