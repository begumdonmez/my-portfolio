import * as THREE from 'three'

export const PIXEL_FONT = '"Press Start 2P", monospace'

function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d'), w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

// Lit sign on top of a cabinet: gradient band with the game title.
export function marqueeTexture(title, [c1, c2]) {
  return canvasTexture(1024, 256, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, 0)
    g.addColorStop(0, c1)
    g.addColorStop(1, c2)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2)

    let size = 76
    ctx.font = `${size}px ${PIXEL_FONT}`
    while (ctx.measureText(title.toUpperCase()).width > w - 80 && size > 28) {
      size -= 4
      ctx.font = `${size}px ${PIXEL_FONT}`
    }
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = '#fff'
    ctx.shadowBlur = 18
    ctx.fillStyle = '#fff'
    ctx.fillText(title.toUpperCase(), w / 2, h / 2 + 4)
    ctx.shadowBlur = 0
    ctx.lineWidth = 6
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.strokeText(title.toUpperCase(), w / 2, h / 2 + 4)
    ctx.fillText(title.toUpperCase(), w / 2, h / 2 + 4)
  })
}

// Transparent overlay text for screens ("INSERT COIN", "YAKINDA", ...)
export function screenTextTexture(text, color = '#ffffff') {
  return canvasTexture(512, 128, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.font = `28px ${PIXEL_FONT}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = color
    ctx.shadowBlur = 14
    ctx.fillStyle = color
    ctx.fillText(text, w / 2, h / 2)
  })
}

// Big neon sign for the back wall.
export function neonSignTexture(lines) {
  return canvasTexture(2048, 640, (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h)
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    lines.forEach(({ text, color, size, y }) => {
      ctx.font = `${size}px ${PIXEL_FONT}`
      for (const blur of [60, 30, 12]) {
        ctx.shadowColor = color
        ctx.shadowBlur = blur
        ctx.fillStyle = color
        ctx.fillText(text, w / 2, y * h)
      }
      ctx.shadowBlur = 0
      ctx.fillStyle = '#ffffff'
      ctx.globalAlpha = 0.85
      ctx.fillText(text, w / 2, y * h)
      ctx.globalAlpha = 1
    })
  })
}

// Classic arcade carpet: dark base with scattered neon shapes.
export function carpetTexture() {
  const tex = canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#0b0a1a'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#2de2e6', '#f706cf', '#fdf500', '#7b61ff', '#ff6c11']
    const rand = (() => {
      let s = 42
      return () => ((s = (s * 16807) % 2147483647) / 2147483647)
    })()
    for (let i = 0; i < 70; i++) {
      const x = rand() * w
      const y = rand() * h
      const c = colors[Math.floor(rand() * colors.length)]
      const r = 6 + rand() * 14
      ctx.strokeStyle = c
      ctx.fillStyle = c
      ctx.globalAlpha = 0.55
      ctx.lineWidth = 3
      const kind = Math.floor(rand() * 4)
      ctx.beginPath()
      if (kind === 0) ctx.arc(x, y, r, 0, Math.PI * 2)
      else if (kind === 1) {
        ctx.moveTo(x, y - r)
        ctx.lineTo(x + r, y + r)
        ctx.lineTo(x - r, y + r)
        ctx.closePath()
      } else if (kind === 2) {
        ctx.moveTo(x - r, y)
        for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(x - r + (k + 0.5) * r * 0.5, y + (k % 2 ? r : -r) * 0.6, x - r + (k + 1) * r * 0.5, y)
      } else {
        ctx.rect(x - r * 0.4, y - r * 0.4, r * 0.8, r * 0.8)
        ctx.fill()
      }
      ctx.stroke()
    }
    ctx.globalAlpha = 1
  })
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}
