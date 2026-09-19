import express from 'express'
import {db, bootstrap} from './db.js'
const app = express()
const port = 3000

bootstrap(app,port);

app.use(express.json())

// 1. Products CRUD

// create a product
app.post('/products',async (req,res,next)=>{
    try {
        const {productName,	price,	stockQuantity,	supplierID} = req.body;
        const [supplier] = await db.execute(`select supplierID from Suppliers where supplierID=?` ,[supplierID])
        if(supplier.length===0){
            return res.status(404).json({Message: "Supplier not found" })
        }
        const insertQuery = `insert into Products(productName,	price,	stockQuantity,	supplierID) values(?,?,?,?)`
        const [product] = await db.execute(insertQuery, [productName,	price,	stockQuantity,	supplierID])
        return res.status(201).json({Message: "Done", product })
    } catch (error) {
        return res.status(500).json({Message: "creation of product failed"})
    }
})

// retreive all products
app.get('/products', async (req,res,next)=>{
    try {
        const [products] = await db.execute(`select * from Products`);
        if(products.length===0){
            return res.status(404).json({message: "There are no products!"})
        }

        return res.status(200).json({message:"Done", products})
    } catch (error) {
        return res.status(500).json({Message: "Failed to retrieve products"})

    }
})

// ​ Retrieve a product by ID
app.get('/products/:id', async (req,res,next)=>{
    try {
        const {id} = req.params
        const [product] = await db.execute(`select * from Products where productID=?`, [id]);
        if(product.length===0){
            return res.status(404).json({message: "product not found!"})
        }

        return res.status(200).json({message:"Done", product})
    } catch (error) {
        return res.status(500).json({Message: "Failed to retrieve products"})

    }
})

// update a product
app.patch('/products/:id', async (req,res,next)=>{
    try {
        const {id} = req.params
        const findQuery = `select * from Products where productID=?`
        const [product] = await db.execute(findQuery,[id])
        if (product.length===0){
            return res.status(404).json({message: "product not found!"})
        }
        const {productName,	price,	stockQuantity} = req.body;
        const updateQuery = `update Products set productName=?,price=?, stockQuantity=? where productID=?`;
        const [updatedProduct] = await db.execute(updateQuery, [productName,	price,	stockQuantity, id]);
        if(updatedProduct.affectedRows===0){
            return res.status(404).json({message: "can't update product!"})
        }

        return res.status(200).json({message:"Done", updatedProduct})
    } catch (error) {
        return res.status(500).json({Message: "Failed to update product"})

    }
})

// Delete a product
app.delete('/products/:id', async (req,res,next)=>{
    try {
        const {id} = req.params
        const findQuery = `select * from Products where productID=?`
        const [product] = await db.execute(findQuery,[id])
        if (product.length===0){
            return res.status(404).json({message: "product not found!"})
        }
        const [deletedProduct] = await db.execute(`Delete from Products where productID=?`, [id]);
        if(deletedProduct.affectedRows===0){
            return res.status(404).json({message: "product not deleted!"})
        }

        return res.status(200).json({message:"Done", deletedProduct})
    } catch (error) {
        return res.status(500).json({Message: "Failed to delete product"})

    }
})


// 2. Suppliers CRUD
// Create a supplier
app.post('/suppliers', async (req,res,next)=>{
    try {
        const {supplierName, contactNumber} = req.body;
        const findQuery = `select * from  Suppliers where contactNumber=?`;
        const [duplicatedSupplier] = await db.execute(findQuery, [contactNumber])
        if(!duplicatedSupplier.length===0){
            return res.status(409).json({Message: "Supplier Already exist!"})
        }
        const insertQuery = `insert into Suppliers(supplierName, contactNumber) values(?,?)`
        const supplier = await db.execute(insertQuery,[supplierName, contactNumber])
        if(supplier.affectedRows===0)
        {
            return res.status(409).json({Message: "Supplier wasn't created!"})
        }
        return res.status(201).json({message:"Done",supplier})

    } catch (error) {
        throw new Error("Failed to create supplier!");
        
    }
})

// Retrieve all suppliers.
app.get('/suppliers', async (req,res,next)=>{
    try {
        const [suppliers] = await db.execute(`select * from Suppliers`) 
        if(suppliers.length===0){
            return res.status(404).json({message: "There are no products!"})
        }
        return res.status(200).json({message: "Done", suppliers})

    } catch (error) {
        throw new Error("Failed to retreive suppliers!");
        
    }
})

// Update supplier information
app.patch('/suppliers/:id', async(req,res,next)=>{
    try {
        const {id} = req.params;
        const {supplierName, contactNumber} = req.body;
        const updateQuery = `update Suppliers set supplierName=?, contactNumber=? where supplierID=?`
        const updatedSupplier = await db.execute(updateQuery,[supplierName, contactNumber, id])
        
        if(updatedSupplier.affectedRows===0){
            return res.status(409).json({Message: "Supplier wasn't updated!"})
        }
        return res.status(200).json({Message: "Supplier Updated", updatedSupplier})
    } catch (error) {
        
    }
})

// ​ Delete a supplier.
app.delete('/suppliers/:id', async (req,res,next)=>{
    try {
        const {id} = req.params
        const findQuery = `select * from Suppliers where supplierID=?`
        const [supplier] = await db.execute(findQuery,[id])
        if (supplier.length===0){
            return res.status(404).json({message: "supplier not found!"})
        }
        const [deletedSupplier] = await db.execute(`Delete from Suppliers where supplierID=?`, [id]);
        if(deletedSupplier.affectedRows===0){
            return res.status(404).json({message: "supplier not deleted!"})
        }

        return res.status(200).json({message:"Done", deletedSupplier})
    } catch (error) {
        return res.status(500).json({Message: "Failed to delete supplier"})

    }
})

// Sales CRUD
// 1. Record a sale
app.post('/sales', async (req, res, next) => {
    try {
        const { productID, quantitySold } = req.body;

        // Check if product exists
        const [product] = await db.execute(`SELECT * FROM Products WHERE productID = ?`, [productID]);
        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        const insertQuery = `INSERT INTO Sales (productID, quantitySold) VALUES (?, ?)`;
        const [sale] = await db.execute(insertQuery, [productID, quantitySold]);

        return res.status(201).json({ message: "Done", sale });
    } catch (error) {
        return res.status(500).json({ Message: "Failed to record sale" });
    }
});

// 2. Retrieve all sales
app.get('/sales', async (req, res, next) => {
    try {
        const [sales] = await db.execute(`SELECT * FROM Sales`);
        if (sales.length === 0) {
            return res.status(404).json({ message: "There are no sales!" });
        }

        return res.status(200).json({ message: "Done", sales });
    } catch (error) {
        return res.status(500).json({ Message: "Failed to retrieve sales" });
    }
});

// 3. Retrieve sales for a specific product
app.get('/sales/product/:productID', async (req, res, next) => {
    try {
        const { productID } = req.params;

        // Check if product exists
        const [product] = await db.execute(`SELECT * FROM Products WHERE productID = ?`, [productID]);
        if (product.length === 0) {
            return res.status(404).json({ message: "Product not found!" });
        }

        // Retrieve sales associated with this product
        const [sales] = await db.execute(`SELECT * FROM Sales WHERE productID = ?`, [productID]);
        if (sales.length === 0) {
            return res.status(404).json({ message: "No sales found for this product!" });
        }

        return res.status(200).json({ message: "Done", sales });
    } catch (error) {
        return res.status(500).json({ Message: "Failed to retrieve product sales" });
    }
});

// Add a Category column to the Products table.
app.post('/prroduct/addcategory', async (req, res, next)=>{
    try {
            const alterQuery = `ALTER TABLE Products ADD COLUMN IF NOT EXISTS Category VARCHAR(255);`;
            const [result] = await db.execute(alterQuery);
            return res.status(200).json({message: "Category column added successfully!",info: result.info })
        } catch (error) {
        return res.status(500).json({ message: "Failed to add category column", error: error.message });
    }
    
})

// Remove the Category column
app.delete('/product/removecategory', async(req, res, next)=>{
    
})