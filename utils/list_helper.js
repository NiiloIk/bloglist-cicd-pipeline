const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs
      .map(blog => blog.likes)
      .reduce((n, sum) => n + sum)
}

const favouriteBlog = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs
      .reduce((max, blog) =>
        (blog.likes > max.likes ? blog : max), blogs[0])
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return 0

  let authorsPosts = []

  blogs.forEach(blog => {
    const existingAuthor = authorsPosts.find(post => post.author === blog.author)

    existingAuthor
      ? existingAuthor.blogs++
      : authorsPosts.push({ author: blog.author, blogs: 1 })
  })

  const authorWithMostBlogs = authorsPosts.reduce((max, current) =>
    (current.blogs > max.blogs ? current : max), { blogs: -1 }).author

  return authorsPosts.find(p => p.author === authorWithMostBlogs)
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return 0

  let authorsPosts = []

  if (blogs.length === 0) return 0

  blogs.forEach(blog => {
    const existingAuthor = authorsPosts.find(post => post.author === blog.author)
    existingAuthor
      ? existingAuthor.likes += blog.likes
      : authorsPosts.push({ author: blog.author, likes: blog.likes })
  })

  const authorWithMostLikes = authorsPosts.reduce((max, current) =>
    (current.likes > max.likes ? current : max), { likes: -1 }).author

  return authorsPosts.find(p => p.author === authorWithMostLikes)
}

module.exports = {
  dummy, totalLikes, favouriteBlog, mostBlogs, mostLikes
}