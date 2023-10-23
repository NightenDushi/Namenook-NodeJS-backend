db_name = "data.db";
const clone_db = require('./copy_db');
const db = require('better-sqlite3')(clone_db(db_name), {fileMustExist:true});

db.pragma('journal_mode = WAL');

function get(pId=false, pTable="movies", pWhere){
    sql = "SELECT * FROM "+pTable;
    arg = [pTable];
    arg = [];

    if (pId != false) {
        sql = "SELECT * FROM "+pTable+" WHERE id=?";
        arg.push(pId);
    }
    if (pWhere!=""){
        sql += ((!pId) ? " WHERE" : " AND")+" owner_id=?";
        arg.push(pWhere);
    };


    // let tables = db.prepare("SELECT * FROM sqlite_master").all();
    // console.log("Tables in db: ", tables)
    console.log("pWhere",pWhere)
    console.log(sql)

    let rows = db.prepare(sql).all(arg);
    // if (rows.length == 1) rows = rows[0];

    return rows;
}

function add(pData, pTable="movies"){
    delete pData.id;
    data_keys = []
    data_values = []
    data_values_question = []
    for (dat in pData) {
        data_keys.push(dat);
        data_values.push(
            // (typeof pData[dat] === 'string' || pData[dat] instanceof String) ? "'"+pData[dat]+"'" : (pData[dat])?pData[dat]:"''"
            pData[dat]
        )
        data_values_question.push("?")
    }

    console.log("Length keys/values", data_keys.length, data_values.length)

    sql = "INSERT INTO "+pTable+ " (" + data_keys.toString(); 
    sql += ") VALUES ("+ data_values_question.toString() + ");";
    console.log(sql)
    
    const stmt = db.prepare(sql).run(data_values);
    // console.log(stmt)
    return  get(stmt.lastInsertRowid, pTable, pData.owner_id)
}

function set(pId, pNewData, pTable="movies"){
    delete pNewData.id;
    data_keys = []
    data_values = []
    data_values_question = []
    for (dat in pNewData) {
        data_keys.push(dat);
        data_values_question.push("?")
        data_values.push(
            // (typeof pNewData[dat] === 'string' || pNewData[dat] instanceof String) ? "'"+pNewData[dat]+"'" : (pNewData[dat])?pNewData[dat]:"''"
            pNewData[dat]
        )
    }
    // console.log(data_keys);
    sql = "UPDATE "+pTable+" SET ("+data_keys.toString()
    sql += ") = (" + data_values_question.toString();
    sql +=") WHERE id=? AND owner_id=?";
    console.log(sql);
    console.log(data_values+[pId])
    data_values.push(pId)
    const stmt = db.prepare(sql).run(data_values, pNewData.owner_id);
    // console.log(stmt)
    return  get(pId, pTable, pNewData.owner_id)
    
}

function del(pId, pTable="movies", pOwnerId){
    sql = "DELETE FROM "+pTable+" WHERE id=? AND owner_id=?";
    const stmt = db.prepare(sql).run([pId, pOwnerId]);
    console.log("deleted",pId)
    if (stmt.changes === 0) return false;
    return get(false, pTable, pOwnerId);
}

module.exports.get = get;
module.exports.add = add;
module.exports.set = set;
module.exports.del = del;
module.exports.db = db;