export default
{
    get_embed_src(param)
    {
        return param
    },

    load_font(name, url, success, error)
    {
        let style = document.createElement('style')
        style.innerHTML = `@font-face{font-family:${name};src: url(${url})}`
        document.head.appendChild(style)
        let checker = document.createElement('span')
        checker.style.position = 'absolute'
        checker.style.visibility = 'hidden'
        checker.style.opacity = '0'
        checker.style.top = '-9999px'
        checker.style.left = '-9999px'
        checker.style.fontSize = '250px'
        checker.style.fontFamily = name
        checker.innerHTML = 'qwertyuiopasdfghjklzxcvbnm1234567890'
        document.body.appendChild(checker)
        return style
    },

    load_css(url)
    {
        let css = document.createElement('link')
        css.href = url
        css.rel = 'stylesheet'
        css.type = 'text/css'
        document.head.appendChild(css)
    },

    load_buffer(url, success, error)
    {
        let reader = new XMLHttpRequest()
        reader.open('GET', url, true)
        reader.withCredentials = false
        reader.responseType = 'arraybuffer'
        reader.onload = evt =>
        {
            success && success(reader.response)
        }
        reader.onerror = error
        reader.send()
    },
}
