const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogList) => {

  const reducer = (sum, item) => {
    return sum+item.likes;
  }

  likes = blogList.reduce(reducer, 0)
  return isNaN(likes)? 0: likes;

}

module.exports = {
  dummy,
  totalLikes
}
