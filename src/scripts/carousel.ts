// Лёгкая карусель на CSS scroll-snap вместо Swiper.
// Разметка: [data-carousel] > [data-carousel-track] > [data-carousel-slide]*,
// опционально [data-carousel-prev|next], [data-carousel-current], [data-carousel-dots].
// Активному (центральному) слайду ставится атрибут data-active.

const initialized = new WeakSet<Element>()

export function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    if (initialized.has(root)) return
    initialized.add(root)

    const track = root.querySelector<HTMLElement>('[data-carousel-track]')!
    const slides = [...track.querySelectorAll<HTMLElement>('[data-carousel-slide]')]
    const current = root.querySelector<HTMLElement>('[data-carousel-current]')
    const dotsBox = root.querySelector<HTMLElement>('[data-carousel-dots]')
    let active = -1

    const dots = slides.map((_, i) => {
      if (!dotsBox) return null
      const dot = document.createElement('button')
      dot.type = 'button'
      dot.className = 'h-2 w-2 rounded-full bg-neutral-600 transition-all hover:bg-blue-300 data-[active]:w-8 data-[active]:bg-primary'
      dot.setAttribute('aria-label', `Слайд ${i + 1}`)
      dot.addEventListener('click', () => goTo(i))
      dotsBox.append(dot)
      return dot
    })

    function goTo(i: number) {
      const index = (i + slides.length) % slides.length
      const slide = slides[index]
      track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: 'smooth' })
    }

    function update() {
      const center = track.scrollLeft + track.clientWidth / 2
      let nearest = 0
      let best = Infinity
      slides.forEach((slide, i) => {
        const distance = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center)
        if (distance < best) {
          best = distance
          nearest = i
        }
      })
      if (nearest === active) return
      active = nearest
      slides.forEach((s, i) => s.toggleAttribute('data-active', i === active))
      dots.forEach((d, i) => d?.toggleAttribute('data-active', i === active))
      if (current) current.textContent = String(active + 1)
    }

    root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => goTo(active - 1))
    root.querySelector('[data-carousel-next]')?.addEventListener('click', () => goTo(active + 1))

    let frame = 0
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(update)
    }, { passive: true })
    addEventListener('resize', update)

    // data-carousel-start="1" — на десктопе начать со второго слайда, чтобы по краям были соседи
    const start = Number(root.dataset.carouselStart ?? 0)
    if (start && slides[start] && matchMedia('(min-width: 1024px)').matches) {
      const slide = slides[start]
      track.scrollTo({ left: slide.offsetLeft - (track.clientWidth - slide.clientWidth) / 2, behavior: 'instant' })
    }
    update()
  })
}
