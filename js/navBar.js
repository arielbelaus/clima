const menuBtn = document.querySelector('.menu-btn')
const selectores = document.querySelector('#selectores')
const nav = document.querySelector('nav')
let menuOpen = false

menuBtn.addEventListener('click', () => {
  if (!menuOpen) {
    menuBtn.classList.add('open')
    selectores.style.display = 'flex'
    if(window.innerWidth >= 485){
      nav.style.height = '35vh'
    } else {
      nav.style.height = '45vh'
    }
    menuOpen = true
  } else {
    menuBtn.classList.remove('open')
    selectores.style.display = 'none'
    nav.style.height = '55px'
    menuOpen = false
  }
})

const selectorProvincia = document.querySelector('#selectores div:nth-child(1)')

selectorProvincia.addEventListener('change', () => {
  const provSelec = selectorP.value
  const selectorMunicipio = document.querySelector('#selectores div:nth-child(2)')
  if (provSelec == 'default' || provSelec == 30 || provSelec == 78 || provSelec == 02 || provSelec == 86 || provSelec == 94) {
    selectorMunicipio.style.display = 'none'
  } else {
    selectorMunicipio.style.display = 'flex'
  }
})