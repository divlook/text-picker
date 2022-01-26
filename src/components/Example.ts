import { css } from '~/emotion'
import { MicroElement } from '~/micro-element'
import { App } from '~/components/App'
import { dodger_blue, white } from '~/palette'
import { rgb } from '~/utils'

export class Example extends MicroElement {
    app = new App()

    mounted(): void {
        this.el.className = Example.styles.container

        this.el.innerHTML = `
            <h1><span>Text Picker</span></h1>

            <h2><span>훈민정음</span></h2>

            <p>
                <span>나라의 말이</span>
                <span>중국과는 달라</span>
                <span>한자와는 서로 맞지 아니하므로</span>
                <span>이런 까닭으로 글을 모르는 백성들이 말하고자 하는 바 있어도</span>
                <span>마침내 제 뜻을 능히 펴지 못할 사람이 많으니라</span>
                <span>내 이를 위하여, 가엾게 여겨</span>
                <span>새로 스물여덟 자를 만드노니</span>
                <span>사람마다 쉽게 익혀 날마다 씀에 편안케 하고자 할 따름이니라</span>
            </p>

            <h2><span>정읍사</span></h2>

            <p><span>달하 노피곰 도드샤</span></p>

            <p><span>어긔야 머리곰 비취오시라</span></p>

            <p><span>어긔야 어강됴리</span></p>

            <p><span>아으 다롱디리</span></p>

            <p><span>져재 녀러신고요</span></p>

            <p><span>어긔야 즌데를 드듸욜셰라.</span></p>

            <p><span>어긔야 어강됴리</span></p>

            <p><span>어느이다 노코시라</span></p>

            <p><span>어긔야 내 가논 데 졈그를셰라</span></p>

            <p><span>어긔야 어강됴리</span></p>

            <p><span>아으 다롱디리</span></p>

            <button class="${Example.styles.button}">Pick</button>
        `

        const button = this.el.querySelector(`.${Example.styles.button}`)

        button?.addEventListener('click', () => {
            this.app.start()
        })

        this.el.appendChild(this.app.el)
    }

    render() {}
}

export namespace Example {
    export namespace styles {
        export const container = css`
            font-family: sans-serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            width: 80%;
            margin: 10% auto;
        `

        export const button = css`
            position: fixed;
            right: 36px;
            bottom: 36px;
            width: 64px;
            height: 64px;
            background: ${rgb(dodger_blue)};
            color: ${rgb(white)};
            border-radius: 50%;
            border: 0;
            cursor: pointer;
            padding: 0;
            font-size: 20px;
            box-shadow: 0 2px 6px 0 rgba(0 0 0 / 40%);
            transition: box-shadow 0.1s, bottom 0.1s;

            &:active {
                bottom: 34px;
                box-shadow: none;
            }
        `
    }
}
