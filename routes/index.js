const axios = require('axios')
const router = require('koa-router')()

const headers = {
  'X-GitHub-Api-Version': '2022-11-28',
  Accept: 'application/vnd.github+json',
  Authorization: 'token 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',
}

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/:id', async (ctx, next) => {
  const { id } = ctx.params
  try {
    const res = await axios({
      method: 'GET',
      url: 'https://api.github.com/repos/johnqiang/stable-diffusion/contents/' + id,
      headers,
    })
    console.log('数据获取成功================', res.data)
    let images = []
    let config = ''
    res.data.forEach(function(item) {
      if (item.download_url.endsWith('json')) {
        config = item.download_url
      } else {
        images.push(item.download_url)
      }
    })
    console.log('========????', images, config)

    const rst = await axios({
      method: 'GET',
      url: config,
      headers,
    })
    console.log('=======res json', rst.data)
    const { prompt, negativePrompt, samplingMethod, samplingSteps, CFG, Seed } = rst.data || {}
    await ctx.render('index', {
      title: 'Stable Diffusion Sharing', images, prompt, negativePrompt, samplingMethod, samplingSteps, CFG, Seed
    })
  } catch (err) {
    console.log(err.message)
  }

})

module.exports = router
