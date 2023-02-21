let express = require("express");
let mysql = require("mysql");
let cors = require("cors");

let app = express();
app.use(express.json());
app.use(cors());

//se establece la conexion
let conexion = mysql.createConnection({
    user:"root",
    host:"localhost",
    password:"ecommerce",
    database:"ecommerce test"
})

//probamos la conexion
conexion.connect(function(error){
    if(error){
        throw error;
    }else{
        console.log("CONEXION A LA BASE DE DATOS EXITOSA")
    }
})

app.get("/", function(req,res){
    res.send("RUTA INICIO");
});

//mostrar todos los articulos
app.get("/api/articulos", (req, res)=>{
    conexion.query("SELECT * FROM productos", (error, filas)=>{
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
})

//mostrar un SOLO articulo
app.get("/api/articulos/:id", (req, res)=>{
    conexion.query("SELECT * FROM productos WHERE id_producto = ?",(req.params.id), (error, fila)=>{
        if(error){
            throw error;
        }else{
            res.send(fila);
        }
    })
})

//añadir articulos
app.post("/api/articulos", (req, res)=>{
    let data = {nombre_producto:req.body.nombre_producto, precio_producto:req.body.precio_producto, stock_producto:req.body.stock_producto};
    let sql = "INSERT INTO productos SET ?";
    conexion.query(sql, data, function(error, results){
        if(error){
            throw error;
        }else{
            Object.assign(data, {id_producto: results.insertId})
            res.send(data);
        }
    })
})

//editar articulos

app.put("/api/articulos/:id", (req, res)=>{
    let id = req.params.id;
    let nombre = req.body.nombre_producto;
    let precio = req.body.precio_producto;
    let stock = req.body.stock_producto;
    let sql = "UPDATE productos SET nombre_producto = ?, precio_producto = ?, stock_producto = ? WHERE productos.id_producto = ?";
    conexion.query(sql, [nombre, precio, stock, id], (error, results)=>{
        if(error){
            throw error;
        }else{
            res.send(results);
        }
    })
})

//eliminar articulo
app.delete("/api/articulos/:id", (req, res)=>{
    conexion.query("DELETE FROM productos WHERE id_producto = ?", [req.params.id], function(error, filas){
        if(error){
            throw error;
        }else{
            res.send(filas);
        }
    })
    })

const puerto = process.env.PUERTO || 8080;


app.listen("8080", function(){
    console.log("SERVIDOR OK en puerto:"+puerto)
});
