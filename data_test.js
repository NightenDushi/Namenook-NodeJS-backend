movies = [
    {id:0, name: "Foo", year:2021},
    {id:1, name: "Bar", year:2021},
    {id:2, name: "Fizz", year:2000},
]

movie_max_id = 2;

function isIdValid(){
    return;
}

function get(pId=false){
    if (!pId) return movies;

    let id = parseInt(pId);
    let movie = movies.find(c => c.id === id);
    if (!movie){
        // res.status(404).send("movie not found");
        return false;
    }
    return movie;
    
}

function add(pData){
    movie_max_id += 1;
    let movie = {
        id:   movie_max_id,
        name: pData.name,
        year: pData.year || 2023,
    }

    
    movies.push(movie)
    return movie;
    
}

function set(pId, pNewData){
    let id = parseInt(pId);
    let movie = get(pId);
    if (pNewData.name){
        movies[id].name = pNewData.name;
    }
    if (pNewData.year){
        movies[id].year = pNewData.year;
    }

    return movie;
}

function del(pId){
    let id = parseInt(pId);
    let movie = get(id);
    if (!movie) return false;

    movies.splice(movies.indexOf(movie), 1);
    return movies;
}

// module.export.isIdValid = isIdValid;
module.exports.get = get;
module.exports.add = add;
module.exports.set = set;
module.exports.del = del;