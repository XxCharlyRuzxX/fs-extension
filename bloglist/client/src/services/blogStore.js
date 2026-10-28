import { create } from "zustand";
import blogService from "./blogs";

const blogStore = create((set) => ({
  blogs: [],
  fetchBlogs: async () => {
    const blogs = await blogService.getAll();
    set({ blogs });
    return blogs;
  },
  createBlog: async (newBlog) => {
    const blog = await blogService.postBlog(newBlog);
    set((state) => ({ blogs: state.blogs.concat(blog) }));
    return blog;
  },
  updateBlog: async (id, updatedBlog) => {
    const blog = await blogService.updateBlog(id, updatedBlog);
    set((state) => ({
      blogs: state.blogs.map((currentBlog) =>
        currentBlog.id === id ? blog : currentBlog
      ),
    }));
    return blog;
  },
  deleteBlog: async (id) => {
    await blogService.deleteBlog(id);
    set((state) => ({
      blogs: state.blogs.filter((blog) => blog.id !== id),
    }));
  },
}));

export const useBlogStore = (selector = (state) => state) =>
  blogStore(selector);
