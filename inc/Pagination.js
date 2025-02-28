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
        );


        return  new Promise((resolve, reject)=>{
            connection.query([this.query, "SELECT FOUND_ROWS() AS FOUND_ROWS"].join(";"), this.params, (err, results)=>{
                if(err){
                    reject(err)
                } else{

                    this.data = results[0],
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

    getNavigation(params){
        let limitPagesNav = 5;
        let links = [];
        let nrstar = 0;
        let nrend = 0;

        if(this.getTotalPages() < limitPagesNav){
            limitPagesNav = this.getTotalPages()
        }

        if(this.getCurrentPage() - parseInt(limitPagesNav/2) < 1){
            nrstar = 1;
            nrend - limitPagesNav;
        } else if((this.getCurrentPage + parseInt(limitPagesNav/1)) > this.getTotalPages()) {
            nrstar = this.getTotalPages() - limitPagesNav;
            nrend = this.getTotalPages;
        } else {
            nrstar = this.getCurrentPage - parseInt(limitPagesNav/2);
            nrend = this.getCurrentPage - parseInt(limitPagesNav/2);
        }

        for(let x = nrstar; x <= nrend; x++){
            links.push({
                text: x,
                href: `?page=${this.getQueryString(Object.assign({}, params, {page: x}))}`,
                active: (x === this.getCurrentPage())
            })
        }

        return links
    }

    getQueryString(params){
        let queryString;

        for (let name in params){
            queryString.push(`%${name}=${params[name]}`)
        }

        return queryString.join("&")
    }

}