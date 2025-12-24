export function paginate(query) {
    let page = Math.max(parseInt(query.page) || 1, 1);
    let pagesize = Math.min(parseInt(query.pagesize) || 10, 100);
    let offset = (page - 1) * pagesize;

    return { page, pagesize, offset };
}
