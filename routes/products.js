const express = require('express');
const router = express.Router();
const {database} = require('../config/helpers');


/* GET ALL PRODUCTS*/
router.get('/', function (req, res) {
    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1;  // set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;   // set the limit of items per page

    let startValue;
    let endValue;

    if (page > 0) {
        startValue = (page * limit) - limit;   // 0,10,20,30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }

    database.table('products as p')
        .join([{
            table: 'categories as c',
            on: 'c.id = p.cat_id'
        }])
        .withFields(['c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.id'
        ])
        .slice(startValue, endValue)
        .sort({id: .1})
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
            } else {
                res.json({message: 'No products founds'});
            }
        }).catch(err => console.log(err));
});

module.exports = router;
