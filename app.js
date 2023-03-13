const { Telegraf } = require('telegraf')
// const fetch = require('node-fetch')
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const fs = require('fs');
const { createWorker } = require('tesseract.js')

const token = '6237833521:AAEXf2LY3SAS28_nadeQVezQeA8TIw0Pvuc';
// const bot = new Telegraf('6237833521:AAEXf2LY3SAS28_nadeQVezQeA8TIw0Pvuc');
const bot = new Telegraf(token);
async function renderImgToText(){
  const worker = await createWorker();

  await worker.loadLanguage('eng');
  await worker.initialize('eng');
  const { data: { text } } = await worker.recognize('./image.png');
  await worker.terminate();
  fs.unlink('./image.png', (err)=>err && console.log(err))
}
bot.on('photo', async (ctx) => {
  ctx.reply('Request is being done...')
  const file_id = ctx.message.photo[ctx.message.photo.length - 1].file_id
  const url = await bot.telegram.getFileLink(file_id)
  const response = await fetch(url.href)
  const buffer = await response.buffer()
  fs.writeFileSync('image.png', buffer)
  const text = await renderImgToText()
  
  ctx.reply(text)
})

bot.on('message', async (ctx) => {
  ctx.reply('commant not found 😞')
})

console.log('server is running ...')

bot.launch()
