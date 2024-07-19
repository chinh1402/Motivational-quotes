exports.authorSlugFromAuthor = (author) =>  {
    return author.toLowerCase().replace(/\s+/g, '-');
}