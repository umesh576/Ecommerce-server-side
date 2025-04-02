"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (page, limit, totalCount) => {
    const totalPage = Math.ceil(totalCount / limit);
    return {
        total: totalCount,
        totalPage,
        currentPage: page,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPage ? page + 1 : null,
        hasNextPage: page < totalPage ? true : false,
    };
};
exports.getPagination = getPagination;
