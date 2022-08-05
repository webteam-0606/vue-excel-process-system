let mysql = require('mysql')

let db = mysql.createPool({
    host: '127.0.0.1',     //数据库IP地址
    user: 'root',          //数据库登录账号
    password: 'root',      //数据库登录密码
    database: 'uploadsearch'       //要操作的数据库
})
module.exports = db

// let pg = require("pg");

// let config = {
//   user: "postgres",
//   database: "uploadsearch",
//   password: "postgres",
//   port: 5432 
// };
// // 创建连接池
// var pool = new pg.Pool(config);
