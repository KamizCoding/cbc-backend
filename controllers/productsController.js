import Products from "../models/products.js"

export function listProducts(req,res){
    Products.find().then(
        (productsList)=>{
            res.status(500).json({
                list : productsList
            })
        }
    ).catch(
        (err)=>{
            res.json({
                message : "Due to an error the product list couldnt be identified"
            })
        }
    )
}

export function newProducts(req,res){

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
    products.save().then(()=>{
        res.json({
            message : "The product was added to the database succesfully"
        })
    }).catch(()=>{
        res.json({
            message : "The product was not added to the database due to an error"
        })
    })
}

export function delProducts(req,res){

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

    Products.deleteOne({name: req.params.name}).then(()=>{
        res.json({
            message : "The producs was deleted from the database succesfully"
        })
    }).catch(()=>{
        res.json({
            message : "The product was not deleted from the database due to an error"
        })
    })
}

export function listProductsByName(req,res){

    const name = req.params.name;

    Products.find({name : name}).then(
        (productsList)=>{
            if(productsList.length == 0){
                res.json({
                    message : "Product not found"
                })
            }else{
            res.json({
                list : productsList
            })
        }
        }
    ).catch(
        ()=>{
            res.json({
                message : "Due to an error the product list couldnt be identified"
            })
        }
    )
}