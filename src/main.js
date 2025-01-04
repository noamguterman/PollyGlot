import OpenAI from 'openai'

let selectedLanguage
let userInputText

document.getElementById('languages').addEventListener('click', (e) => {
    if (e.target.dataset.language) {
        handleSelectLanguage(e.target.dataset.language)
    }
})

document.getElementById('send-btn').addEventListener('click', handleSendButton)

function handleSelectLanguage(language) {
    selectedLanguage = language
    
    const languageBtns = document.getElementsByClassName('btn-language')
    for (let btn of languageBtns) {
        btn.classList.remove('selected')
    }
    
    const languageImgs = document.getElementsByClassName('img-language')
    for (let img of languageImgs) {
        img.classList.remove('selected')
    }
    
    document.getElementById(`btn-${language}`).classList.add('selected')
    document.getElementById(`img-${language}`).classList.add('selected')
}

function handleSendButton() {
    const inputField = document.getElementById('input-txt')
    
    userInputText = inputField.value
    
    if (selectedLanguage && userInputText) {
        renderUserMessage(userInputText)
        inputField.value = ''
        fetchTranslation(userInputText, selectedLanguage)
    }
}

function renderUserMessage(userInputText) {
    const messagesDiv = document.getElementById('messages')
    
    const userMessageEl = document.createElement('p')
    userMessageEl.classList.add('msg')
    userMessageEl.classList.add('user')
    userMessageEl.textContent = userInputText
    
    messagesDiv.appendChild(userMessageEl)
    messagesDiv.scrollTop = userMessageEl.offsetHeight + userMessageEl.offsetTop
}

async function fetchTranslation(userInputText, selectedLanguage) {
    const messages = [
        {
            role: 'system',
            content: 'You are a virtual translator agent called PollyGlot. You take in the user input text and return the translation in the language that is provided in the prefix (jp for Japanese, es for Spanish etc.)'
        },
        {
            role: 'user',
            content: `${selectedLanguage} ${userInputText}`
        }
    ]
    
    try {
        const openai = new OpenAI({
            apiKey: import.meta.env.VITE_OPENAI_API_KEY,
            dangerouslyAllowBrowser: true
        })
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages,
            max_tokens: 64,
            temperature: 0.5
        })
        
        renderBotMessage(response.choices[0].message.content)
        
    } catch(err) {
        console.log('Error:', err)
        alert('Unable to access AI. Please refresh and try again')
    }
}

function renderBotMessage(message) {
    const messagesDiv = document.getElementById('messages')
    
    const botMessageEl = document.createElement('p')
    botMessageEl.classList.add('msg')
    botMessageEl.classList.add('bot')
    botMessageEl.textContent = message
    
    messagesDiv.appendChild(botMessageEl)
    messagesDiv.scrollTop = botMessageEl.offsetHeight + botMessageEl.offsetTop
}