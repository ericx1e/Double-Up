let keyInputs = {}

let playerSize = 30
let blockSize = 50
let bulletSize = 10
let bulletDamage = 10

let speed = 0.7
let bulletSpeed = 10
let gravityF = 0.5
let jump = -13
let cooldown = 20

// let healthBarSize = playerSize * 1.5

let maxHitpoints = 100

let player1 = { //Map position
    x: 0,
    y: 0,
    dir: 1,
    yDir: 0,
    relX: 0,
    relY: 0,
    yv: 0,
    xv: 0,
    grounded: false,
    blocks: [],
    bullets: [],
    lastShootFrame: -cooldown,
    hitpoints: maxHitpoints,
    targetHitpoints: maxHitpoints,
}

let player2 = {
    x: 0,
    y: 0,
    dir: 1,
    yDir: 0,
    relX: 0,
    relY: 0,
    yv: 0,
    xv: 0,
    grounded: false,
    blocks: [],
    bullets: [],
    lastShootFrame: -cooldown,
    hitpoints: maxHitpoints,
    targetHitpoints: maxHitpoints,
}

let map;

function preload() {
    map = loadStrings('map.txt')
}

function setup() {
    let canvas = createCanvas(window.innerWidth, window.innerHeight)
    canvas.position(0, 0)

    player1.x = width / 4
    player1.y = height / 2
    player2.relX = player1.x
    player2.relY = player1.y
    player2.x = width * 3 / 4
    player2.y = height / 2
    player1.relX = player2.x
    player1.relY = player2.y

    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r].charAt(c) == '1') {
                let block = new Block(c * blockSize, r * blockSize)
                block.x = width / 4 + block.startX - map[0].length / 2 * blockSize - 100
                block.y = height / 2 + block.startY - map.length / 2 * blockSize
                player1.blocks.push(block)
                block = new Block(c * blockSize, r * blockSize)
                block.x = width * 3 / 4 + block.startX - map[0].length / 2 * blockSize + 100
                // player2.relX = block.startX - block.x
                block.y = height / 2 + block.startY - map.length / 2 * blockSize
                player2.blocks.push(block)
            }
        }
    }

    /*
    let blockRate = 0.2
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (Math.random() < blockRate && c != 2 && c != map[r].length - 2 && r != map.length - 3) {
                let block = new Block(c * blockSize, r * blockSize)
                // block.x = width / 4 + block.startX - map[0].length / 2 * blockSize
                // block.y = height / 2 + block.startY - map.length / 2 * blockSize
                block.x = width / 4 + block.startX + blockSize * 2
                block.y = height / 2 + block.startY - map.length * blockSize - blockSize * 2
                player1.blocks.push(block)
                block = new Block(c * blockSize, r * blockSize)
                block.x = width * 3 / 4 + block.startX - map[0].length * blockSize - blockSize * 2
                // player2.relX = block.startX - block.x
                block.y = height / 2 + block.startY - map.length * blockSize - blockSize * 2
                player2.blocks.push(block)
            }
        }
    }
    */
}

function draw() {
    background(51)

    gravity(player1)
    gravity(player2)
    controls()

    player1.relX = player1.blocks[0].startX - player1.blocks[0].x
    player1.relY = player1.blocks[0].startY - player1.blocks[0].y
    player2.relX = player2.blocks[0].startX - player2.blocks[0].x
    player2.relY = player2.blocks[0].startY - player2.blocks[0].y

    // player1.targetHitpoints = Math.max(player1.targetHitpoints, 0)
    // player1.target = Math.max(player1.hitpoints, 0)
    player1.hitpoints = lerp(player1.hitpoints, player1.targetHitpoints, 0.1)
    player2.hitpoints = lerp(player2.hitpoints, player2.targetHitpoints, 0.1)

    //PLAYER 1
    if (player1.blocks[0].x + player2.x + player2.relX < width / 2 - playerSize) {
        fill(255, 150, 100)
        stroke(255, 100, 60)
        strokeWeight(5)
        rectMode(CORNER)
        noStroke()
        rect(player1.blocks[0].x + player2.x + player2.relX, player1.blocks[0].y + player2.y + player2.relY, playerSize, playerSize, playerSize / 5)

        push()
        strokeCap(SQUARE)
        translate(player1.blocks[0].x + player2.x + player2.relX, player1.blocks[0].y + player2.y + player2.relY)
        stroke(150)
        strokeWeight(playerSize / 5)
        line(0, -playerSize / 2, playerSize, -playerSize / 2)
        colorMode(HSB, maxHitpoints, 255, 255, 255)
        stroke(30 * player2.hitpoints / maxHitpoints, 255, 255)
        line(0, -playerSize / 2, playerSize * player2.hitpoints / maxHitpoints, -playerSize / 2)
        pop()
    }
    strokeWeight(5)
    rectMode(CORNER)
    fill(100, 100, 255)
    stroke(60, 60, 255)
    noStroke()
    rect(player1.x, player1.y, playerSize, playerSize, playerSize / 5)

    for (let i = 0; i < player1.bullets.length; i++) {
        bullet = player1.bullets[i]
        if (bullet.x < width / 2 - bulletSize) {
            bullet.show()
        }
        bullet.update(player1.blocks, player1, player2)
        if (bullet.dead) {
            player1.bullets.splice(i, 1)
            i--
        }
    }
    for (let i = 0; i < player2.bullets.length; i++) {
        bullet = player2.bullets[i]
        if (player1.blocks[0].x + bullet.x + player2.relX < width / 2 - bulletSize) {
            push()
            fill(255, 150, 100)
            translate(player1.blocks[0].x + player2.relX, player1.blocks[0].y + player2.relY)
            bullet.show()
            pop()
            // ellipse(player1.blocks[0].x + bullet.x + player2.relX, player1.blocks[0].y + bullet.y + player2.relY, bulletSize, bulletSize)
        }
        if (bullet.dead) {
            player2.bullets.splice(i, 1)
            i--
        }
    }

    player1.blocks.forEach(block => {
        if (block.x < width / 2 - blockSize) {
            block.show()
        }
    })

    push()
    strokeCap(SQUARE)
    translate(player1.x, player1.y)
    stroke(150)
    strokeWeight(playerSize / 5)
    line(0, -playerSize / 2, playerSize, -playerSize / 2)
    colorMode(HSB, maxHitpoints, 255, 255, 255)
    stroke(30 * player1.hitpoints / maxHitpoints, 255, 255)
    line(0, -playerSize / 2, playerSize * player1.hitpoints / maxHitpoints, -playerSize / 2)
    pop()

    //PLAYER 2
    if (player2.blocks[0].x + player1.x + player1.relX > width / 2) {
        fill(100, 100, 255)
        stroke(60, 60, 255)
        strokeWeight(5)
        rectMode(CORNER)
        noStroke()
        rect(player2.blocks[0].x + player1.x + player1.relX, player2.blocks[0].y + player1.y + player1.relY, playerSize, playerSize, playerSize / 5)

        push()
        strokeCap(SQUARE)
        translate(player2.blocks[0].x + player1.x + player1.relX, player2.blocks[0].y + player1.y + player1.relY)
        stroke(150)
        strokeWeight(playerSize / 5)
        line(0, -playerSize / 2, playerSize, -playerSize / 2)
        colorMode(HSB, maxHitpoints, 255, 255, 255)
        stroke(30 * player1.hitpoints / maxHitpoints, 255, 255)
        line(0, -playerSize / 2, playerSize * player1.hitpoints / maxHitpoints, -playerSize / 2)
        pop()
    }

    fill(255, 150, 100)
    stroke(255, 100, 60)
    strokeWeight(5)
    rectMode(CORNER)
    // translate(width * 3 / 4, height / 2)

    noStroke()
    rect(player2.x, player2.y, playerSize, playerSize, playerSize / 5)

    for (let i = 0; i < player2.bullets.length; i++) {
        bullet = player2.bullets[i]
        if (bullet.x > width / 2 - bulletSize) {
            bullet.show()
        }
        bullet.update(player2.blocks, player2, player1)
        if (bullet.dead) {
            player2.bullets.splice(i, 1)
            i--
        }
    }
    for (let i = 0; i < player1.bullets.length; i++) {
        bullet = player1.bullets[i]
        if (player2.blocks[0].x + bullet.x + player1.relX > width / 2 - bulletSize) {
            push()
            fill(100, 100, 255)
            translate(player2.blocks[0].x + player1.relX, player2.blocks[0].y + player1.relY)
            bullet.show()
            pop()
        }
        if (bullet.dead) {
            player1.bullets.splice(i, 1)
            i--
        }
    }

    player2.blocks.forEach(block => {
        if (block.x > width / 2) {
            block.show()
        }
    })

    push()
    strokeCap(SQUARE)
    translate(player2.x, player2.y)
    stroke(150)
    strokeWeight(playerSize / 5)
    line(0, -playerSize / 2, playerSize, -playerSize / 2)
    colorMode(HSB, maxHitpoints, 255, 255, 255)
    stroke(30 * player2.hitpoints / maxHitpoints, 255, 255)
    line(0, -playerSize / 2, playerSize * player2.hitpoints / maxHitpoints, -playerSize / 2)
    pop()

    stroke(0)
    strokeWeight(blockSize * 2)
    line(width / 2, 0, width / 2, height)
}

function gravity(player) {
    let oyv = player.yv
    player.y += player.yv
    if (touchingBlocks(player)) {
        player.blocks.forEach(block => {
            block.y += player.yv
        })
        player.bullets.forEach(bullet => {
            bullet.y += player.yv
        })

        if (player.yv > 0) {
            player.yv = 0
            player.grounded = true
        } else {
            player.yv = Math.abs(player.yv) / 2
        }
    } else {
        player.yv += gravityF
        player.grounded = false
    }

    player.y -= oyv

    player.blocks.forEach(block => {
        block.y -= player.yv
    })
    player.bullets.forEach(bullet => {
        bullet.y -= player.yv
    })
}

function controls() {
    /*
        if (keyInputs[LEFT_ARROW]) {
            player2.dir = -1
            player2.x -= speed
            if (!touchingBlocks(player2)) {
                player2.blocks.forEach(block => {
                    block.x += speed
                })
                player2.bullets.forEach(bullet => {
                    bullet.x += speed
                })
            }
            player2.x += speed
        }
        if (keyInputs[RIGHT_ARROW]) {
            player2.dir = 1
            player2.x += speed
            if (!touchingBlocks(player2)) {
                player2.blocks.forEach(block => {
                    block.x -= speed
                })
                player2.bullets.forEach(bullet => {
                    bullet.x -= speed
                })
            }
            player2.x -= speed
        }
    */

    if (keyInputs[LEFT_ARROW]) {
        player2.dir = -1
        player2.xv -= speed
    }

    if (keyInputs[RIGHT_ARROW]) {
        player2.dir = 1
        player2.xv += speed
    }

    player2.x += player2.xv
    if (!touchingBlocks(player2)) {
        player2.blocks.forEach(block => {
            block.x -= player2.xv
        })
        player2.bullets.forEach(bullet => {
            bullet.x -= player2.xv
        })
    }

    player2.x -= player2.xv

    player2.xv *= 0.9

    if (keyInputs[UP_ARROW]) {
        if (player2.grounded) {
            player2.yv = jump
        }
    }

    if (keyInputs[191]) {
        if (frameCount - player2.lastShootFrame > cooldown) {
            player2.bullets.push(new Bullet(player2.x + (player2.dir > 0 ? playerSize : 0), player2.y + playerSize / 2, player2.dir))
            player2.lastShootFrame = frameCount
        }
    }
    // if (keyInputs[DOWN_ARROW]) {

    // }

    if (keyInputs[81]) {
        if (frameCount - player1.lastShootFrame > cooldown) {
            player1.bullets.push(new Bullet(player1.x + (player1.dir > 0 ? playerSize : 0), player1.y + playerSize / 2, player1.dir))
            player1.lastShootFrame = frameCount
        }
    }

    /*
    if (keyInputs[65]) { //a key
        player1.dir = -1
        player1.x -= speed
        if (!touchingBlocks(player1)) {
            player1.blocks.forEach(block => {
                block.x += speed
            })
            player1.bullets.forEach(bullet => {
                bullet.x += speed
            })
        }
        player1.x += speed
    }
    if (keyInputs[68]) { //d key
        player1.dir = 1
        player1.x += speed
        if (!touchingBlocks(player1)) {
            player1.blocks.forEach(block => {
                block.x -= speed
            })
            player1.bullets.forEach(bullet => {
                bullet.x -= speed
            })
        }
        player1.x -= speed
    }
    */

    if (keyInputs[65]) {
        player1.dir = -1
        player1.xv -= speed
    }

    if (keyInputs[68]) {
        player1.dir = 1
        player1.xv += speed
    }

    player1.x += player1.xv
    if (!touchingBlocks(player1)) {
        player1.blocks.forEach(block => {
            block.x -= player1.xv
        })
        player1.bullets.forEach(bullet => {
            bullet.x -= player1.xv
        })
    }

    player1.x -= player1.xv

    player1.xv *= 0.9


    if (keyInputs[87]) {
        if (player1.grounded) {
            player1.yv = jump
        }
    }
    // if (keyInputs[83]) {

    // }
}

function Block(x, y) {
    this.startX = x
    this.startY = y
    this.x = this.startX
    this.y = this.startY
    this.s = blockSize

    this.show = function () {
        rectMode(CORNER)
        fill(100)
        stroke(90)
        strokeWeight(10)
        noStroke()
        rect(this.x, this.y, this.s, this.s)
    }
}

function Bullet(x, y, dir) {
    this.x = x
    this.y = y
    this.relX = 0
    this.relY = 0
    this.dir = dir
    this.hit = false
    this.dead = false
    this.particles = []

    this.update = function (blocks, shooter, target) {
        if (this.hit) return

        this.x += bulletSpeed * this.dir

        blocks.forEach(block => {
            if (rectCircleColliding({ x: this.x, y: this.y, r: bulletSize / 2 }, { x: block.x, y: block.y, w: blockSize, h: blockSize })) {
                this.hit = true
            }
        })

        if (rectCircleColliding({ x: this.x, y: this.y, r: bulletSize / 2 }, { x: shooter.blocks[0].x + target.x + target.relX, y: shooter.blocks[0].y + target.y + target.relY, w: playerSize, h: playerSize })) {
            this.hit = true
            target.targetHitpoints -= bulletDamage
        }

        if (this.hit) {
            for (let i = 0; i < 10; i++) {
                this.particles.push(new Particle(0, 0))
            }
        }
    }

    this.show = function () {
        if (this.dead) return
        if (this.hit) {
            for (let i = 0; i < this.particles.length; i++) {
                let particle = this.particles[i]
                push()
                translate(this.x, this.y)
                particle.show()
                pop()
                if (particle.dead) {
                    this.particles.splice(i, 1)
                    i--
                    if (this.particles.length == 0) {
                        this.dead = true
                        break
                    }
                }
            }
        } else {
            ellipse(this.x, this.y, bulletSize)
        }
    }
}

function keyPressed() {
    keyInputs[keyCode] = true
}

function keyReleased() {
    keyInputs[keyCode] = false
}

function touchingBlocks(player) {
    for (let i = 0; i < player.blocks.length; i++) {
        let block = player.blocks[i]
        if (player.x + playerSize > block.x && player.x < block.x + blockSize && player.y + playerSize > block.y && player.y < block.y + blockSize) {
            return true
        }
    }
    return false
}

function rectCircleColliding(circle, rect) {
    var distX = Math.abs(circle.x - rect.x - rect.w / 2);
    var distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) { return false; }
    if (distY > (rect.h / 2 + circle.r)) { return false; }

    if (distX <= (rect.w / 2)) { return true; }
    if (distY <= (rect.h / 2)) { return true; }

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

function Particle(x, y) {
    this.x = x
    this.y = y
    this.speed = random(1, 1.5)
    this.startingSize = random(bulletSize / 4, bulletSize / 2)
    this.size = this.startingSize
    this.dir = random(0, 2 * PI)
    this.startingLife = random(10, 40)
    this.life = this.startingLife
    this.dead = false

    this.show = function () {
        push()
        translate(this.x, this.y)
        this.x += this.speed * Math.cos(this.dir)
        this.y += this.speed * Math.sin(this.dir)
        // fill(color)
        noStroke()
        ellipse(0, 0, this.size, this.size)
        pop()
        this.life--
        this.size -= this.startingSize / this.startingLife
        if (this.life <= 0) {
            this.dead = true
        }
    }
}