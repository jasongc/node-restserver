var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    priceSale: { type: String, required: [true, 'El precio de venta es necesario'] },
    priceUnit: { type: Number, required: [true, 'El precio únitario es necesario'] },
    description: { type: String, required: false },
    isDeleted: { type: Boolean, required: true, default: false },
    categoryId: { type: String, required: true },
    SKU: { type: String, required: true },
    //Auditoría
    insertDate: { type: Date, default: new Date() },
    insertUserId: { type: String, required: [true, 'El ID del usuario es necesario'] },
    updateDate: { type: String, required: false },
    updateUserId: { type: String, required: false },
});


module.exports = mongoose.model('Producto', productoSchema);