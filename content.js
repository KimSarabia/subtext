const flaggedTerms = {
  "female scientist":'Consider whether gender is necessary. Wikipedia style prefers gender-neutral phrasing.',
  "chairman": "Use 'chairperson' or 'chair' unless the title is official.",
  "manpower": "Consider 'workforce' or 'personnel' for gender-neutral phrasing.",
  "businessman": "Try 'businessperson' or just 'entrepreneur'.",
  "unmanned": "Use 'uncrewed' or 'autonomous' where appropriate.",
  "waitress": "Use 'server' or 'waitstaff'.",
  "wife": "Use 'spouse' or 'partner'.",
  "husband": "Use 'spouse' or 'partner'.",
  "salesman": "Use 'salesperson' or 'sales associate'.",
  "policeman": "Use 'police officer' or 'law enforcement officer'.",
  "freshman": "Use 'first-year student' or 'new student'.",
  "fireman": "Use 'firefighter' or 'fire service personnel'."
}

const replaceTerms = {
  "chairman": 'Chairperson',
  "businessman": 'Businessperson',
  "waitress": 'Server',
  "salesman": 'Salesperson',
  "policeman": 'Police officer',
  "freshman": 'First-year student',
  "fireman": 'Firefighter',
  "unmanned": 'Uncrewed',
  "manpower": 'Workforce',
  "female scientist": 'Scientist',
  "wife": 'Spouse',
  "husband": 'Spouse',
}

const getKey = (text)=>{
  const lowerText = text.toLowerCase()
  console.log(text)
  for (const term in flaggedTerms) {
    if (lowerText.includes(term)) {
      return term
    }
  }
  return null
}

const ignoredSet = new Set()

function scanAndFlag(node) {
  for (const term in flaggedTerms) {
    const xpath =
      `//span[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//p[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//b[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//div[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h1[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h2[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h3[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h4[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h5[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//h6[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')] | ` +
      `//i[contains(translate(text(),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz'),'${term}')]`
    const matchingElements = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
      null
    )
    for (let i = 0; i < matchingElements.snapshotLength; i++) {
      const element = matchingElements.snapshotItem(i)
      console.log({ element })
      if (
        !element.classList.contains('flagged-term') &&
        !ignoredSet.has(element)
      ) {
        element.classList.add('flagged-term')
        ignoredSet.add(element)
      }
    }
  }
}
console.log('Content script loaded and running...')

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log({ mutation })
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === 1) {
        console.log('working')
        scanAndFlag(node)
      }
    })
  })
})

observer.observe(document.body, {
  childList: true,
  subtree: true,
})

// Also scan any existing content
const element = document.querySelector('.mw-body-content')
if (element) {
  scanAndFlag(element)
}

document.addEventListener('keydown', (event) => {
  scanAndFlag(document.querySelector('.mw-body-content'))
})

document.addEventListener('mouseover', (event) => {
  if (event.target.classList.contains('flagged-term')) {
    const modal = document.createElement('div')
    modal.classList.add('flagged-term-modal')
    const downArrow = document.createElement('div')
    downArrow.classList.add('down-arrow')
    modal.appendChild(downArrow)
    const rect = event.target.getBoundingClientRect()
    modal.style.top = `${
      rect.top + window.scrollY - modal.offsetHeight - 100
    }px`
    modal.style.left = `${rect.left + window.scrollX}px`

    const ignoreButton = document.createElement('button')
    ignoreButton.classList.add('ignore-button')
    ignoreButton.textContent = 'Ignore'
    ignoreButton.onclick = () => {
      event.target.classList.remove('flagged-term')
      document.body.removeChild(modal)
    }

    const fixButton = document.createElement('button')
    fixButton.classList.add('fix-button')
    fixButton.textContent = 'Fix'
    fixButton.onclick = () => {
      for (const [term, replacement] of Object.entries(replaceTerms)) {
        event.target.innerHTML = event.target.innerHTML.replace(
          new RegExp(term, 'gi'),
          replacement
        )
      }
      event.target.classList.remove('flagged-term')
      document.body.removeChild(modal)
    }

    const message = document.createElement('h6')
    message.textContent = 'Gendered language detected'

    const description = document.createElement('p')
    description.textContent =
      'Perhaps you meant say: ' +
      replaceTerms[getKey(event.target.innerText.toLowerCase())] +
      '? ' +
      flaggedTerms[getKey(event.target.innerText.toLowerCase())]

    modal.appendChild(message)

    const div = document.createElement('div')
    div.appendChild(description)
    div.appendChild(ignoreButton)
    div.appendChild(fixButton)
    modal.appendChild(div)
    document.body.appendChild(modal)

    modal.onmouseenter = () => {
      modal.style.pointerEvents = 'auto'
    }

    modal.onmouseleave = () => {
      console.log('removing')
      modal.style.pointerEvents = 'none'
      document.body.removeChild(modal)
    }
  }
})
