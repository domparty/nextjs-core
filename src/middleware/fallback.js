/**
 * Renders a fallback page if Next.JS isn't ready to handle requests
 *
 * @param core
 */
module.exports = next = (core) => {
  /**
   * Return the middleware
   */
  return (req, res, next) => {
    if (core._nextReady) {
      return next();
    }

    res.send(template());
  }
};

/**
 * Defines the fallback html template
 *
 * @return {string}
 */
const template = () => {
  const packageInformation = require(__dirname + '/../../package.json');

  return `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Next.JS Is Warming Up...</title>
        <style>
            * {
                font-family: Verdana, Arial;
                font-size: 20px;
                font-weight: bold;
                text-align: center;
                background-color: black;
                color: white;
            }
        
            .text {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        
            footer {
                position: fixed;
                bottom: 15px;
                left: 15px;
                font-size: 15px;
            }
        
            @keyframes blink {
                0% {
                    opacity: 0.2;
                }
                20% {
                    opacity: 1;
                }
                100% {
                    opacity: 0.2;
                }
            }
        
            .loading span {
                font-family: Verdana;
                font-size: 72px;
                line-height: 95px;
                animation-name: blink;
                animation-duration: 1.4s;
                animation-iteration-count: infinite;
                animation-fill-mode: both;
            }
        
            .loading span:nth-child(2) {
                animation-delay: 0.2s;
            }
        
            .loading span:nth-child(3) {
                animation-delay: 0.4s;
            }
        </style>
    </head>
    <body>
        <span class="text">
            Next.JS Is Warming Up...<br/>
            Page will reload when the Next.JS is ready<br/> 
            <span class="loading">
                <span>○</span>
                <span>○</span>
                <span>○</span>
            </span>
        </span>
        <footer>Core Version: v${packageInformation.version}</footer>
        <script>
            setInterval(function () {
                const xhr = new XMLHttpRequest();
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === XMLHttpRequest.DONE) {
                        if (xhr.status === 200) {
                            if (xhr.responseText === 'true') {
                                window.location.reload();
                            }
                        }
                    }
                };
                xhr.open("GET", "/core-ready-check-url", true);
                xhr.send();
            }, 1000);
        </script>
    </body>
    </html>
  `;
};
