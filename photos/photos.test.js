/**
 * @jest-environment jsdom
 */

require("@testing-library/jest-dom")
const domTesting = require("@testing-library/dom")
const userEvent = require("@testing-library/user-event").default

const fs = require("fs")

function initDomFromFiles(htmlPath, jsPath) {
  const html = fs.readFileSync(htmlPath, "utf8")
  document.open()
  document.write(html)
  document.close()
  jest.isolateModules(function () {
    require(jsPath)
  })
}

test("photo card is created when URL and caption are provided", async function () {
  initDomFromFiles(
    __dirname + "/photos.html",
    __dirname + "/photos.js"
  )

  const urlInput = domTesting.getByLabelText(document, "Photo URL")
  const captionInput = domTesting.getByLabelText(document, "Caption")
  const addPhotoButton = domTesting.getByRole(document, "button")
  const photoCardList = domTesting.getByRole(document, "list")

  const user = userEvent.setup()
  await user.type(urlInput, "http://placekitten.com/480/480")
  await user.type(captionInput, "Kitty photo")
  await user.click(addPhotoButton)

  expect(photoCardList).not.toBeEmptyDOMElement()

  const photoCards = domTesting.queryAllByRole(document, "listitem")
  expect(photoCards).toHaveLength(1)

  const photoCard = photoCards[0]
  const img = domTesting.queryByRole(photoCard, "img")
  expect(img).toHaveAttribute("src", "http://placekitten.com/480/480")

  const caption = domTesting.queryByText(photoCard, "Kitty photo")
  expect(caption).not.toBeNull()
})

test("clears form when correctly submitted", async function () {
  initDomFromFiles(
    __dirname + "/photos.html",
    __dirname + "/photos.js"
  )

  const urlInput = domTesting.getByLabelText(document, "Photo URL")
  const captionInput = domTesting.getByLabelText(document, "Caption")
  const addPhotoButton = domTesting.getByRole(document, "button")

  const user = userEvent.setup()
  await user.type(urlInput, "http://placekitten.com/480/480")
  await user.type(captionInput, "Kitty photo")
  await user.click(addPhotoButton)

  expect(urlInput).not.toHaveValue()
  expect(captionInput).not.toHaveValue()
})

test("no photo card is added without a caption", async function () {
  initDomFromFiles(
    __dirname + "/photos.html",
    __dirname + "/photos.js"
  )

  const urlInput = domTesting.getByLabelText(document, "Photo URL")
  const addPhotoButton = domTesting.getByRole(document, "button")
  const photoCardList = domTesting.getByRole(document, "list")

  const user = userEvent.setup()
  await user.type(urlInput, "http://placekitten.com/480/480")
  await user.click(addPhotoButton)

  expect(photoCardList).toBeEmptyDOMElement()
  expect(urlInput).toHaveValue("http://placekitten.com/480/480")
})

test("photo card is created when URL and caption are provided", async function () {
  initDomFromFiles(
    __dirname + "/photos.html",
    __dirname + "/photos.js"
  )

  const urlInput = domTesting.getByLabelText(document, "Photo URL")
  const captionInput = domTesting.getByLabelText(document, "Caption")
  const addPhotoButton = domTesting.getByRole(document, "button")
  const photoCardList = domTesting.getByRole(document, "list")

  const user = userEvent.setup()
  await user.type(urlInput, "http://placekitten.com/480/480")
  await user.type(captionInput, "Kitty photo")
  await user.click(addPhotoButton)

  await user.type(urlInput, "http://placekitten.com/320/320")
  await user.type(captionInput, "Kitty photo #3")
  await user.click(addPhotoButton)

  expect(photoCardList).toMatchSnapshot()
})
