const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');

const newDiet = data => Object.assign(
  {
    id: String(Math.random()
      .toString(16)
      .split('.')[1]),
  },
  data
);
// GET /diets
router.get('/', (req, res) => {
  const diet = db.get('diets').value();
  res.json({ status: 'OK', data: diet });
});

// GET /diets/:id
router.get('/:id', (req, res, next) => {
  const diet = db
    .get('diets')
    .find({ id: req.params.id })
    .value();
  if (diet) {
    res.json({ status: 'OK', data: diet });
  } else {
    next();
  }
});

// PATCH
router.patch('/:id', (req, res, next) => {
  // const requestBodySchema = {
  //   id: 'path-diet',
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

  const diet = db
    .get('diets')
    .find({ id: req.params.id })
    .assign(req.body)
    .value();

  db.write();

  res.json({ status: 'OK', data: diet });
});

// POST /diet
router.post('/', (req, res, next) => {
  // const requestBodySchema = {
  //   id: 'path-diet',
  //   type: 'object',
  //   properties: { text: { type: 'string' } },
  //   required: ['text'],
  //   additionalProperties: false,
  // };
  //
  // if (!validate(req.body, requestBodySchema).valid) {
  //   next(new Error('INVALID_API_FORMAT'));
  // }

  const diet = newDiet(req.body);

  db.get('diets')
    .push(diet)
    .write();

  res.json({ status: 'OK', data: diet });
});
// DELETE /diets/:id
router.delete('/:id', (req, res) => {
  db.get('diets')
    .remove({ id: req.params.id })
    .write();

  res.json({ status: 'OK' });
});

module.exports = router;
