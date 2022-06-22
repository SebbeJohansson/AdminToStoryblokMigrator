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

const data = ["fields id,slug,title,description,role,duration,content,date,size,link,code,orderID;", "sort orderID desc;"];
let blogPosts = [];
await axios
  .post("https://admin.sebbejohansson.com/api/portfolios/get", data.join(""))
  .then((response) => {
    //console.log(response.data);
    console.log(response.data);
    blogPosts = response.data;
  })
  .catch((error) => {
    console.log(error.response);
  });
//blogPosts = blogPosts.slice(0,1);
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
        component: "portfolio-entry",
        content: [
          {
            component: "text",
            text: richtextData,
          },
        ],
        role: blogPost.role,
        duration: blogPost.duration,
        description: blogPost.description,
        size: blogPost.size === 1 ? "small" : "big",
        link: {
          "id": "",
          "url": blogPost.link,
          "linktype": "url",
          "cached_url": blogPost.link
        },
        code: {
          "id": "",
          "url": blogPost.code,
          "linktype": "url",
          "cached_url": blogPost.code
        },
      },
      first_published_at: blogPost.date,
    },
    publish: 1,
  })
    .then((response) => {
      // console.log(response)
    })
    .catch((error) => {
      console.log(blogPost.slug, " - ", error.response.status);
    });
});
