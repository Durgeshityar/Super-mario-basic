const canvas = document.querySelector('canvas') // select canvas from html

//getting toolls for canvas
const c = canvas.getContext('2d')

//canavas size = size of window
canvas.width = 1024
canvas.height = 576

//Images

const platfromImg = new Image()
platfromImg.src = './img/platform.png'

const hillsImg = new Image()
hillsImg.src = './img/hills.png'

const backgroundImg = new Image()
backgroundImg.src = './img/background.png'

const tallWall = new Image()
tallWall.src = './img/platformST.png'

//sprite images
const spriteRunLeft = new Image()
spriteRunLeft.src = './img/spriteRunLeft.png'

const spriteRunRight = new Image()
spriteRunRight.src = './img/spriteRunRight.png'

const spriteStandLeft = new Image()
spriteStandLeft.src = './img/spriteStandLeft.png'

const spriteStandRight = new Image()
spriteStandRight.src = './img/spriteStandRight.png'

const gravity = 0.5

class Player {
  constructor() {
    this.speed = 10
    this.position = {
      //position of a player
      x: 100,
      y: 300,
    }

    this.velocity = {
      // for adding gravity
      x: 0,
      y: 0, // on canasv y=0 -> top as you go downwards number increases
    }

    this.width = 66
    this.height = 150

    this.image = spriteStandRight
    this.frames = 0
    this.sprite = {
      stand: {
        right: spriteStandRight,
        left: spriteStandLeft,
        cropWidth: 177,
        width: 66,
      },
      run: {
        right: spriteRunRight,
        left: spriteRunLeft,
        cropWidth: 341,
        width: 127.85,
      },
    }

    this.currentSprite = this.sprite.stand.right
    this.currentCropWidth = 177
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++
    if (
      this.frames > 59 &&
      (this.currentSprite === this.sprite.stand.right ||
        this.currentSprite === this.sprite.stand.left)
    ) {
      this.frames = 0
    } else if (
      this.frames > 29 &&
      (this.currentSprite === this.sprite.run.right ||
        this.currentSprite === this.sprite.run.left)
    ) {
      this.frames = 0
    }
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity
  }
}

class Platform {
  constructor({ x, y }, img) {
    this.position = {
      x,
      y,
    }
    this.image = img
    this.width = 580
    this.height = 125
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObject {
  constructor({ x, y }, img) {
    this.position = {
      x,
      y,
    }
    this.image = img
    this.width = 580
    this.height = 125
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

let player = new Player()
let genericObjects = []
let platforms = []
let currentKey

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
}

let scrollOfset = 0

function init() {
  // instance of all  the class
  player = new Player()
  genericObjects = [
    new GenericObject({ x: 0, y: -1 }, backgroundImg),
    new GenericObject({ x: 150, y: -1 }, hillsImg),
  ]
  platforms = [
    new Platform({ x: 579 * 4 + 710, y: 300 }, tallWall),
    new Platform({ x: 0, y: 470 }, platfromImg),
    new Platform({ x: 579, y: 470 }, platfromImg),
    new Platform({ x: 579 * 2 + 170, y: 470 }, platfromImg),
    new Platform({ x: 579 * 3 + 300, y: 470 }, platfromImg),
    new Platform({ x: 579 * 4 + 450, y: 470 }, platfromImg),
    new Platform({ x: 579 * 5 + 950, y: 470 }, platfromImg),
  ]

  scrollOfset = 0
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach((genericObject) => genericObject.draw())

  platforms.forEach((platform) => platform.draw())

  player.update()

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = 5
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOfset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -5
  } else {
    player.velocity.x = 0

    //simulating movement effect

    if (keys.right.pressed) {
      scrollOfset += player.speed
      platforms.forEach((platform) => (platform.position.x -= player.speed))
      genericObjects.forEach(
        (object) => (object.position.x -= player.speed * 0.66)
      )
    } else if (keys.left.pressed && scrollOfset > 0) {
      scrollOfset -= player.speed
      platforms.forEach((platform) => (platform.position.x += player.speed))
      genericObjects.forEach(
        (object) => (object.position.x += player.speed * 0.66)
      )
    }
  }

  // Platform collision detection
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0
    }
  })

  //sprite switching condition

  if (
    keys.right.pressed &&
    currentKey === 'right' &&
    player.currentSprite !== player.sprite.run.right
  ) {
    player.frames = 1
    player.currentSprite = player.sprite.run.right
    player.currentCropWidth = player.sprite.run.cropWidth
    player.width = player.sprite.run.width
  } else if (
    keys.left.pressed &&
    currentKey === 'left' &&
    player.currentSprite !== player.sprite.run.left
  ) {
    player.currentSprite = player.sprite.run.left
    player.currentCropWidth = player.sprite.run.cropWidth
    player.width = player.sprite.run.width
  } else if (
    !keys.left.pressed &&
    currentKey === 'left' &&
    player.currentSprite !== player.sprite.stand.left
  ) {
    player.currentSprite = player.sprite.stand.left
    player.currentCropWidth = player.sprite.stand.cropWidth
    player.width = player.sprite.stand.width
  } else if (
    !keys.right.pressed &&
    currentKey === 'right' &&
    player.currentSprite !== player.sprite.stand.right
  ) {
    player.currentSprite = player.sprite.stand.right
    player.currentCropWidth = player.sprite.stand.cropWidth
    player.width = player.sprite.stand.width
  }

  if (scrollOfset > 579 * 5 + 970)
    // win condition
    console.log('YOU WIN')

  // loose  condition
  if (player.position.y > canvas.height) init()
}

init()
animate()
// WSAD => up donw left right
window.addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = true
      currentKey = 'left'

      break

    case 83:
      console.log('down')
      break

    case 68:
      console.log('right')
      keys.right.pressed = true
      currentKey = 'right'

      break

    case 87:
      console.log('up')
      player.velocity.y -= 10
      break
  }
})

window.addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = false
      player.currentSprite = player.sprite.stand.left
      player.currentCropWidth = player.sprite.stand.cropWidth
      player.width = player.sprite.stand.width
      break

    case 83:
      console.log('down')
      break

    case 68:
      console.log('right')
      keys.right.pressed = false

      break

    case 87:
      console.log('up')
      //player.velocity.y -= 10
      break
  }
})
