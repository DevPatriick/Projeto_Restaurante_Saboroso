// const { validator\ } = require('express-validator');
const connection = require('./db')

module.exports = class Pagination {

    constructor(query, 
        params = [],
        itensPerPage = 10
    ){
        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
    }

    getPage(page){

        this.currentPages = page - 1;



        this.params.push(
            this.currentPages * this.itensPerPage,
            this.itensPerPage
        )


        return  new Promise((resolve, reject)=>{
            connection.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results)=>{
                if(err){
                    reject(err)
                } else{

                    this.data = results[0];
                    this.currentPages = this.currentPages, 
                    this.total = results[1][0].FOUND_ROWS,
                    this.totalPages = Math.ceil(this.total / this.itensPerPage);
                    this.currentPages++

                    resolve(this.data)
                }
            })
        })
    }

    getTotal(){
        return this.total;
    }

    getCurrentPage(){
        return this.currentPages
    }

    getTotalPages(){
        return this.totalPages;
    }

}