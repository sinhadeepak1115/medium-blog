import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { verify } from 'hono/jwt'

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();


blogRouter.use('/*', async (c, next) => {
  const authHeader = c.req.header("authorization") || "";
  const header = authHeader.split(" ")[1]

  console.log(header)
  console.log(authHeader)

  try {
    const user = await verify(header, c.env?.JWT_SECRET)
    console.log("next router");
    if (user) {
      await next()
    }
  } catch (e) {
    console.log(e)
    c.status(403)
    return c.json({ error: "Couldn't move to the next router" })

  }
})

blogRouter.post('/', (c) => {

  return c.text('post blog')
})
blogRouter.put('/', (c) => {
  return c.text('put blog')
})
blogRouter.get('/:id', (c) => {
  const id = c.req.param('id')
  console.log(id)
  return c.text('get blog route')
})
blogRouter.get('/bluk', (c) => {
  return c.text('get blog bulk')
})

