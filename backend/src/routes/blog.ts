import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  },
  Variables: {
    userId: string;
  }
}>();


blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const header = authHeader.split(" ")[1]

  try {
    const user = await verify(header, c.env?.JWT_SECRET)
    if (user) {
      c.set("userId", user.id);
      await next()
    }
  } catch (e) {
    console.log(e)
    c.status(403)
    return c.json({ error: "Couldn't move to the next router" })

  }
})

blogRouter.post('/', async (c) => {
  const body = await c.req.json();
  const authorId = c.get("userId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      authorId: Number(authorId)
    }
  });
  return c.json(blog);
}
)

blogRouter.put('/', async (c) => {
  const body = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate())

  const blog = await prisma.blog.update({
    where: {
      id: body.id,
    },
    data: {
      title: body.title,
      content: body.content
    }
  });
  return c.json(blog)
})

blogRouter.get('/:id', (c) => {
  const id = c.req.param('id')
  console.log(id)
  return c.text('get blog route')
})
blogRouter.get('/bluk', (c) => {
  return c.text('get blog bulk')
})

