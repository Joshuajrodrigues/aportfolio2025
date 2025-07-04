import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema:({image})=> z.object({
    title: z.string(),
    type: z.string(),
    description: z.string(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: image(),
    tag: z.array(z.string()).optional(),
    blog: z.array(z.string()).optional(),
    link: z.string(),
    colors: z.array(z.string()),
  }),
});

const project = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/project", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema:({image})=> z.object({
    title: z.string(),
    type: z.string(),
    description: z.string(),
    featured: z.boolean().default(false),
    src: image(),
    tags: z.array(z.string()).optional(),
    contentBlocks: z.array(z.string()).optional(),
    caraousel: z.array(z.string()).optional(),
    heroHelpText: z.string().optional(),
    role: z.string().optional(),
    team: z.string().optional(),
    impact: z.string().optional(),
    // Transform string to Date object
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage:  image(),
    colors: z.array(z.string()).optional(),
  }),
});

const art = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/art", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema:({image})=> z.object({
    title: z.string(),
    type: z.string(),
    src:  image() ,
  }),
});

const recomends = defineCollection({
  // Load Markdown and MDX files in the `src/content/blog/` directory.
  loader: glob({ base: "./src/content/recomends", pattern: "**/*.{md,mdx}" }),
  // Type-check frontmatter using a schema
  schema:({image})=> z.object({
    title: z.string(),
    type: z.string(),
    src: image(),
  }),
});
export const collections = { art, blog, project, recomends };
