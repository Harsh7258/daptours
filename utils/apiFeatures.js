//BUILD QUERY
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // 1.1 FILTERING THE API
    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'fields', 'limit', 'sort'];
        excludedFields.forEach(el => delete queryObj[el]);

    // 1.2 ADVANCE FILTERING 
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        // gte = greater than equal to, lt = less than, gt = great than
        console.log(JSON.parse(queryStr));

        this.query = this.query.find(JSON.parse(queryStr));
        // to find all documents/data

        return this;
    }

    // 2. SORTING
    sort() {
    if(this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        console.log(sortBy);
        this.query = this.query.sort(sortBy);
    } else {
        this.query = this.query.sort('-createdAt');
        // set according time
         }
         return this;
         // return the entire object then has access to these other methods so we can call them
    }

    // 3. LIMITING FIELDS
    limitFields() {
    if (this.queryString.fields) {
        const fields = this.queryString.fields.split(',').join(' ');
        console.log(fields);
        this.query = this.query.select(fields);
    } else {
        this.query = this.query.select('-__v');
        // exclude this field
    }

    return this;
    }

    // 4. PAGINATION
    paginate() {
    const pages = this.queryString.page *  1 || 1;
    // converts string into a number
    const limit = this.queryString.limit * 1 || 100;
    const skip = (pages - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
    }
}

module.exports =  APIFeatures;