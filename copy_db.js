const fs = require("fs");
const path = require("path");

function clone_db(pDatabase){
    console.log("Cloning the database...")
    new_database = pDatabase.replace(/.+(?=\..*$)/g, "$&_copy")
    new_database_path = path.resolve(__dirname, new_database);
    // console.log(new_database_path)
    // console.log
    // fs.unlinkSync(new_database_path);
    
    fs.copyFileSync(path.resolve(__dirname, pDatabase), new_database_path)
    return new_database_path;
}

module.exports = clone_db;