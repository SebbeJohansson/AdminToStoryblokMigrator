import axios from "axios";
import StoryblokClient from "storyblok-js-client";
import TurndownService from "turndown";
import markdownConverter from "storyblok-markdown-richtext";

// rember to remove
const spaceId = 151486;
let Storyblok = new StoryblokClient({
  // Remmber to remove
  oauthToken: "sB95UP70Oko4MDQCSKb79gtt-112653-eSzMek4_t7nc5zvDm7VZ",
});

const data = ["fields id,title,slug,content,author,date,cat,status;"];
let blogPosts = [];
await axios
  .post("https://admin.sebbejohansson.com/api/blogs/get", data.join(""))
  .then((response) => {
    //console.log(response.data);
    blogPosts = response.data;
  })
  .catch((error) => {
    console.log(error.response);
  });

blogPosts.forEach((post) => {
  const blogPost = post;

  const turndownService = new TurndownService();
  const richtextData = markdownConverter.markdownToRichtext(
    turndownService.turndown(blogPost.content)
  );
  console.log(richtextData);

  // use the universal js client to perform the request
  Storyblok.post(`spaces/${spaceId}/stories/`, {
    story: {
      name: blogPost.title,
      slug: blogPost.slug,
      content: {
        component: "blog-entry",
        content: [
          {
            component: "text",
            text: richtextData,
          },
        ],
        date: blogPost.date,
      },
      first_published_at: blogPost.date,
    },
    publish: blogPost.status,
  })
    .then((response) => {
      // console.log(response)
    })
    .catch((error) => {
      console.log(blogPost.slug, " - ", error.response.status);
    });
});
