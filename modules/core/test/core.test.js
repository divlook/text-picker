import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { after, afterEach, before, beforeEach, test } from 'node:test'
import { chromium } from 'playwright'

let server
let browser
let context
let page
let origin

before(async () => {
  server = createServer(async (request, response) => {
    if (request.url === '/') {
      response.setHeader('Content-Type', 'text/html')
      response.end('<!doctype html><html><body></body></html>')
      return
    }
    try {
      const path = new URL(request.url, 'http://localhost').pathname
      response.setHeader('Content-Type', 'text/javascript')
      response.end(await readFile(new URL(`../dist${path}`, import.meta.url)))
    } catch {
      response.writeHead(404)
      response.end()
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  origin = `http://localhost:${server.address().port}`
  browser = await chromium.launch()
})

after(async () => {
  await browser?.close()
  if (server) await new Promise((resolve) => server.close(resolve))
})

beforeEach(async () => {
  context = await browser.newContext({ viewport: { width: 1000, height: 800 } })
  page = await context.newPage()
  await page.goto(origin)
  await page.evaluate(async () => {
    window.Retriever = (await import('/retriever.js')).Retriever
    window.copyText = (await import('/clipboard.js')).copyText
  })
})

afterEach(async () => {
  await context?.close()
})

test(
  'inline sentences, explicit breaks, paragraphs and image syntax survive extraction',
  { timeout: 15000 },
  async () => {
    const text = await page.evaluate(() => {
      document.body.innerHTML =
        '<div style="position:absolute;left:30px;top:30px;width:160px;height:100px">Hello <b>world</b>!<br>Next<div>Paragraph <i>end</i>.</div><img alt="icon" src="image.png"></div>'
      return new window.Retriever().retrieveNow({
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 200,
        bottom: 150,
        width: 180,
        height: 130,
      }).text
    })
    assert.equal(text, 'Hello world!\nNext\nParagraph end.\n![icon](image.png)')
  },
)

test(
  'partial selections preserve whitespace between separately selected inline roots',
  { timeout: 15000 },
  async () => {
    const result = await page.evaluate(() => {
      document.body.innerHTML =
        '<div style="position:absolute;left:100px;top:100px;width:800px;height:300px;text-indent:100px"><b>Hello</b> <span>world!</span></div>'
      const result = new window.Retriever().retrieveNow({
        x: 90,
        y: 90,
        left: 90,
        top: 90,
        right: 310,
        bottom: 210,
        width: 220,
        height: 120,
      })
      return {
        text: result.text,
        roots: result.elements.map((el) => el.textContent),
      }
    })
    assert.deepEqual(result, {
      text: 'Hello world!',
      roots: ['Hello', 'world!'],
    })
  },
)

test(
  'adjacent inline roots do not gain spaces and a BR between roots is retained',
  { timeout: 15000 },
  async () => {
    const results = await page.evaluate(() => {
      const parent = document.createElement('div')
      parent.style =
        'position:absolute;left:100px;top:100px;width:800px;height:300px'
      document.body.append(parent)
      const retriever = new window.Retriever()
      const box = {
        x: 90,
        y: 90,
        left: 90,
        top: 90,
        right: 310,
        bottom: 210,
        width: 220,
        height: 120,
      }
      parent.innerHTML = '<b>Hello</b><span>world!</span>'
      const adjacent = retriever.retrieveNow(box).text
      parent.innerHTML = '<b>Hello</b><br><span>world!</span>'
      return { adjacent, broken: retriever.retrieveNow(box).text }
    })
    assert.deepEqual(results, {
      adjacent: 'Helloworld!',
      broken: 'Hello\nworld!',
    })
  },
)

test(
  'nested scaled iframe coordinates include borders and padding',
  { timeout: 15000 },
  async () => {
    const result = await page.evaluate(async () => {
      const frame = document.createElement('iframe')
      frame.style =
        'position:absolute;left:100px;top:100px;width:240px;height:160px;border:10px solid black;padding:30px;transform:scale(1.5);transform-origin:top left'
      frame.srcdoc =
        '<iframe style="position:absolute;left:10px;top:10px;width:140px;height:80px;border:2px solid black;padding:4px" srcdoc="&lt;div style=&quot;position:absolute;left:10px;top:10px;width:100px;height:40px&quot;&gt;Nested frame&lt;/div&gt;"></iframe>'
      const loaded = new Promise((resolve) => {
        frame.onload = resolve
      })
      document.body.append(frame)
      await loaded
      const result = new window.Retriever().retrieveNow({
        x: 199,
        y: 199,
        left: 199,
        top: 199,
        right: 349,
        bottom: 259,
        width: 150,
        height: 60,
      })
      return { text: result.text, rects: result.rects }
    })
    assert.deepEqual(result, {
      text: 'Nested frame',
      rects: [{ left: 199, top: 199, right: 349, bottom: 259 }],
    })
  },
)

test(
  'an inaccessible iframe does not stop extraction from the rest of the selection',
  { timeout: 15000 },
  async () => {
    const result = await page.evaluate(async () => {
      const frame = document.createElement('iframe')
      frame.setAttribute('sandbox', '')
      frame.style =
        'position:absolute;left:30px;top:30px;width:150px;height:80px;border:0'
      frame.srcdoc = '<p>Inaccessible</p>'
      const loaded = new Promise((resolve) => {
        frame.onload = resolve
      })
      document.body.append(frame)
      await loaded
      document.body.insertAdjacentHTML(
        'beforeend',
        '<div id="available" style="position:absolute;left:30px;top:130px;width:150px;height:40px">Available text</div>',
      )
      const result = new window.Retriever().retrieveNow({
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 200,
        bottom: 200,
        width: 180,
        height: 180,
      })
      return { text: result.text, ids: result.elements.map((el) => el.id) }
    })
    assert.deepEqual(result, { text: 'Available text', ids: ['available'] })
  },
)

test(
  'three contained sides select the entire element; two do not',
  { timeout: 15000 },
  async () => {
    const result = await page.evaluate(() => {
      document.body.innerHTML =
        '<div id="target" style="position:absolute;left:30px;top:30px;width:220px;height:90px">Whole element</div>'
      const box = {
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 200,
        bottom: 140,
        width: 180,
        height: 120,
      }
      const retriever = new window.Retriever()
      const threeSides = retriever.retrieveNow(box).text
      document.querySelector('#target').style.height = '200px'
      return { threeSides, twoSides: retriever.retrieveNow(box).text }
    })
    assert.deepEqual(result, { threeSides: 'Whole element', twoSides: '' })
  },
)

test(
  'clear cancels old work and permits a new subscription and scan',
  { timeout: 15000 },
  async () => {
    await page.clock.install()
    await page.evaluate(() => {
      document.body.innerHTML =
        '<div id="target" style="position:absolute;left:30px;top:30px;width:120px;height:60px">Old text</div>'
      window.box = {
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 180,
        bottom: 120,
        width: 160,
        height: 100,
      }
      window.retriever = new window.Retriever()
      window.retriever.retrieveNow(window.box)
      window.retriever.retrieve(window.box)
      window.retriever.clear()
      window.events = []
      window.retriever.on((result) => window.events.push(result.text))
    })
    await page.clock.runFor(1000)
    assert.deepEqual(await page.evaluate(() => window.events), [])
    const events = await page.evaluate(() => {
      document.querySelector('#target').textContent = 'New text'
      window.retriever.retrieveNow(window.box)
      return window.events
    })
    assert.deepEqual(events, ['New text'])
  },
)

test(
  'immediate retrieval returns a replacement node and cancels the older scheduled result',
  { timeout: 15000 },
  async () => {
    await page.clock.install()
    const result = await page.evaluate(() => {
      document.body.innerHTML =
        '<div id="target" style="position:absolute;left:30px;top:30px;width:120px;height:60px">Old text</div>'
      const box = {
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 180,
        bottom: 120,
        width: 160,
        height: 100,
      }
      window.retriever = new window.Retriever()
      window.events = []
      window.retriever.on((result) => window.events.push(result.text))
      window.retriever.retrieveNow(box)
      window.retriever.retrieve(box)
      const old = document.querySelector('#target')
      const replacement = old.cloneNode(true)
      replacement.textContent = 'Latest text'
      old.replaceWith(replacement)
      const result = window.retriever.retrieveNow(box)
      return {
        text: result.text,
        selectedReplacement: result.elements[0] === replacement,
        connected: result.elements[0].isConnected,
      }
    })
    assert.deepEqual(result, {
      text: 'Latest text',
      selectedReplacement: true,
      connected: true,
    })
    await page.clock.runFor(1000)
    assert.deepEqual(await page.evaluate(() => window.events), [
      'Old text',
      'Latest text',
    ])
  },
)

test(
  'copying from a real click writes freshly retrieved text to the browser clipboard',
  { timeout: 15000 },
  async () => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], {
      origin,
    })
    await page.evaluate(() => {
      document.body.innerHTML =
        '<div id="target" style="position:absolute;left:30px;top:30px;width:160px;height:80px">Old text</div><button style="position:absolute;left:250px;top:30px">Copy</button>'
      const box = {
        x: 20,
        y: 20,
        left: 20,
        top: 20,
        right: 200,
        bottom: 140,
        width: 180,
        height: 120,
      }
      const retriever = new window.Retriever()
      retriever.retrieveNow(box)
      const old = document.querySelector('#target')
      const replacement = old.cloneNode(true)
      replacement.innerHTML = 'Latest <b>value</b>!<br>Second line'
      old.replaceWith(replacement)
      document.querySelector('button').onclick = async () => {
        window.copyResult = await window.copyText(
          retriever.retrieveNow(box).text,
        )
      }
    })
    await page.getByRole('button', { name: 'Copy', exact: true }).click()
    await page.waitForFunction(() => window.copyResult !== undefined)
    assert.equal(await page.evaluate(() => window.copyResult.code), 'SUCCESS')
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      'Latest value!\nSecond line',
    )
  },
)

test(
  'clipboard failures remain classified and empty text never invokes the writer',
  { timeout: 15000 },
  async () => {
    const result = await page.evaluate(async () => {
      let emptyWrites = 0
      const empty = await window.copyText('', async () => {
        emptyWrites++
      })
      const denied = await window.copyText('text', async () => {
        throw new DOMException('denied', 'NotAllowedError')
      })
      const unsupported = await window.copyText('text', async () => {
        throw new DOMException('unsupported', 'NotSupportedError')
      })
      const dom = await window.copyText('text', async () => {
        throw new DOMException('invalid', 'InvalidStateError')
      })
      const unknown = await window.copyText('text', async () => {
        throw new Error('failed')
      })
      return {
        empty: empty.code,
        emptyWrites,
        denied: denied.code,
        unsupported: unsupported.code,
        dom: dom.code,
        unknown: unknown.code,
      }
    })
    assert.deepEqual(result, {
      empty: 'NO_TEXT_SELECTED',
      emptyWrites: 0,
      denied: 'PERMISSION_DENIED',
      unsupported: 'NOT_SUPPORTED',
      dom: 'DOM_EXCEPTION',
      unknown: 'UNKNOWN_ERROR',
    })
  },
)

test(
  'removing the Chrome action listener stops further deliveries',
  { timeout: 15000 },
  async () => {
    const clicks = await page.evaluate(async () => {
      const { ChromeSDK } = await import('/chrome/sdk.js')
      const listeners = new Set()
      Object.defineProperty(window, 'chrome', {
        configurable: true,
        value: {
          action: {
            onClicked: {
              addListener: (listener) => listeners.add(listener),
              removeListener: (listener) => listeners.delete(listener),
            },
          },
        },
      })
      const clicks = []
      const subscription = new ChromeSDK().addClickListenerToActionIcon((tab) =>
        clicks.push(tab.id),
      )
      for (const listener of listeners) listener({ id: 1 })
      subscription.remove()
      for (const listener of listeners) listener({ id: 2 })
      return clicks
    })
    assert.deepEqual(clicks, [1])
  },
)
