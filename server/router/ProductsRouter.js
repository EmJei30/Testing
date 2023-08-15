const express = require('express');
const {
    getSolandCat,
    getProducts,
    getProduct,
    InsertNewProducts,
    createHistory ,
    updateProducts,
    deleteRecord,
    getProductChanges,
    generateSTA,
    getSTAChanges,
    getAXpriceGroup,
    getProductMaster,
    NewProducts
} = require('../controller/ProductsController');

const {
    getMasterFile,
    uploadMasterFile,
    filterMasterFile
} = require('../controller/MasterFileControllet');

const router = express.Router();
/** GEt a product */
router.get('/solAndCat', getSolandCat);

/** GEt a product */
router.get('/', getProducts);

/** GEt a product */
router.get('/master', getProductMaster);

/** GEt a product */
router.get('/getProduct', getProduct);

/**Get sta from Database */
router.get('/getAX', getAXpriceGroup);

/** Post a product */
router.post('/new', NewProducts);

/** Post a product */
router.post('/insert', InsertNewProducts);

/**Post a history */
router.post('/history', createHistory);

/**Fetch Masterfile */
router.get('/masterfile', getMasterFile);

/**Filter Masterfile */
router.post('/masterfile/filter', filterMasterFile);

/**upload Masterfile */
router.post('/masterfile/upload', uploadMasterFile);

/**Update products */
router.put('/:id', updateProducts)

/** Delete product */
router.delete('/:id', deleteRecord);

/** get products that has changes */
router.get('/getchanges', getProductChanges);

/** generate STA */
router.get('/STA', generateSTA);

/** generate STA with changes */
router.get('/STAChanges', getSTAChanges);

module.exports = router;
