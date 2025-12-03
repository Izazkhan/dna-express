export function paginate(query) {
    let page = parseInt(query.page) || 1;
    let limit = parseInt(query.limit) || 10;
    let offset = (page - 1) * limit;

    return { page, limit, offset };
}
