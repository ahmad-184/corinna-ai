import axios from "axios";

type PostType = {
  id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  createdAt: Date;
};

export const getAllPosts = async () => {
  try {
    const posts: PostType[] = [];

    let postsUrl = process.env.WORDPRESS_POSTS_URL as string;
    const { data: postsData } = await axios.get(postsUrl);
    if (!postsData.length) return [];
    let mediasUrl = process.env.WORDPRESS_FEATURED_IMAGES_URL as string;
    const { data: mediaData } = await axios.get(mediasUrl);
    if (!mediaData.length) return [];
    for (let i = 0; i < postsData.length; i++) {
      posts.push({
        id: postsData[i].id,
        title: postsData[i].title.rendered,
        slug: postsData[i].slug,
        content: postsData[i].content.rendered,
        createdAt: new Date(postsData[i].date),
        image: mediaData[i].media_details.file,
      });
    }

    return posts;
  } catch (err) {
    console.log(err);
    return [];
  }
};

export const getSinglePost = async ({ slug }: { slug: string }) => {
  try {
    let postsUrl = process.env.WORDPRESS_POSTS_URL as string;
    let authorUrl = process.env.WORDPRESS_USERS_URL as string;

    const { data: postData } = await axios.get(`${postsUrl}?slug=${slug}`);
    if (!postData.length) return null;

    const author = await axios.get(`${authorUrl}/${postData[0].author}`);
    if (!author) return null;

    return {
      id: postData[0].id,
      title: postData[0].title.rendered,
      content: postData[0].content.rendered,
      createdAt: new Date(postData[0].date),
      author: author.data.name,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
