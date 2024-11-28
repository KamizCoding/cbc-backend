import Products from "../models/products.js"

export async function listProducts(req,res){

    try {
    const productsList = await Products.find()
            res.json({
                        list : productsList
                    })
    } catch (error) {
        res.json({
            message : "Due to an error the product list couldnt be identified"
        })
    }          
}

export async function newProducts(req,res){

    console.log(req.user)

    if(req.user == null){
        res.json({
            message : "You are not logged in"
        })
        return
    }

    if(req.user.type != "admin"){
        res.json({
            message : "You are not an admin and are not authorized to do this function"
        })
        return
    }

    const products = new Products(req.body)
    
    try {
        await products.save()
        res.json({
            message : "The product was added to the database succesfully"
        })

    } catch (error) {
        res.json({
            message : "The product was not added to the database due to an error"
        })
    }
}

export async function delProducts(req,res){

    console.log(req.user)

    if(req.user == null){
        res.json({
            message : "You are not logged in"
        })
        return
    }

    if(req.user.type != "admin"){
        res.json({
            message : "You are not an admin and are not authorized to do this function"
        })
        return
    }
    
    try {
        await Products.deleteOne({name: req.params.name})
        res.json({
            message : "The producs was deleted from the database succesfully"
        })
    } catch (error) {
        res.json({
            message : "The product was not deleted from the database due to an error"
        })
    }
}

export async function listProductsByName(req, res) {
    const name = req.params.name;

    try {
        await Products.find({ name: name }).then((productsList) => {
            if (productsList.length == 0) {
                res.json({
                    message: "Product not found",
                });
            } else {
                res.json({
                    list: productsList,
                });
            }
        });
    } catch (error) {
        res.json({
            message: "Due to an error the product list couldn't be identified",
        });
    }
}
