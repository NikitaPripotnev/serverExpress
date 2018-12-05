const router = require('express').Router();
const db = require('../db/db');
const { validate } = require('jsonschema');

// GET /diet
router.get('/', (req, res) => {
  const diet = db.get('diet').value();
  console.log('get diet');
  res.json({ status: 'OK', data: diet });
});

// GET /diet/:id
router.get('/:id', (req, res) => {
  const diet = db
    .get('diet')
    .find({ id: req.params.id })
    .value();


  const food = db.get('food').filter(itemFood => {
    return diet.food
      .some(item => itemFood.id == item);
  });


  res.json({ status: 'OK', data: diet, food });
});

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

  const diet = db
    .get('diet')
    .find({ id: req.params.id }).food
    .push(req.body);

  db.write();

  res.json({ status: 'OK', data: diet });
});

// DELETE /food/:id
router.delete('/:id', (req, res) => {
  db
    .get('diet')
    .remove({ id: req.params.id })
    .write();

  res.json({ status: 'OK' });
});

module.exports = router;
