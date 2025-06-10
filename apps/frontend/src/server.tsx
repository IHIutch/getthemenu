import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server'

import { createRouter } from './router'

const customStreamHandler = async (context) => {
    const response = await defaultStreamHandler(context)

    const originalText = await response.text()
    const transformedText = originalText.replace(
        /\sdata-evt-([\w-]+)=(".*?"|'.*?')/g,
        (_match, attrName, attrValue) => {
            // Only allow a whitelist if needed
            if (attrName === 'onload') {
                return ` onload=${attrValue}`
            }
            return ''
        }
    )

    return new Response(transformedText, {
        status: response.status,
        headers: response.headers,
    })
}

export default createStartHandler({
    createRouter,
})(customStreamHandler)