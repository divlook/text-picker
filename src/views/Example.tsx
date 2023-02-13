import { FC, useCallback } from 'react'
import TextPicker from '~/components/TextPicker'
import * as styles from '~/views/Example.styles'
import { useSmartState } from '~/libs/hooks/smart-state'
import { Outline } from '~/libs/global/types'
import { debounce } from '~/libs/utils'

const Example: FC = () => {
    const AppName = 'Text Picker'

    const [state, setState] = useSmartState({
        blocks: [] as Outline[],
        isRunning: false,
    })

    const startApp = () => {
        setState({
            isRunning: true,
        })
    }

    const createBlock = useCallback(
        debounce(1000, (outline: Outline) => {
            setState((prev) => {
                return {
                    blocks: prev.blocks.concat([
                        {
                            ...outline,
                        },
                    ]),
                }
            })
        }),
        [],
    )

    const removeBlock = (index: number) => {
        setState((prev) => {
            prev.blocks.splice(index, 1)

            return {
                blocks: prev.blocks,
            }
        })
    }

    return (
        <>
            <div className={styles.container}>
                <h1>
                    <span>Text Picker</span>
                </h1>

                <h2>
                    <span>이미지</span>
                </h2>

                <p>
                    <img
                        src='/icon@16.png'
                        alt={AppName}
                        style={{ display: 'inline-block' }}
                    />
                    <img
                        src='/icon@48.png'
                        alt={AppName}
                        style={{ display: 'inline-block' }}
                    />
                    <img
                        src='/icon@128.png'
                        alt={AppName}
                        style={{ display: 'inline-block' }}
                    />
                </p>

                <h2>
                    <span>훈민정음</span>
                </h2>

                <p>
                    <span>나라의 말이</span>
                    <span>중국과는 달라</span>
                    <span>한자와는 서로 맞지 아니하므로</span>
                    <span>
                        이런 까닭으로 글을 모르는 백성들이 말하고자 하는 바
                        있어도
                    </span>
                    <span>마침내 제 뜻을 능히 펴지 못할 사람이 많으니라</span>
                    <span>내 이를 위하여, 가엾게 여겨</span>
                    <span>새로 스물여덟 자를 만드노니</span>
                    <span>
                        사람마다 쉽게 익혀 날마다 씀에 편안케 하고자 할
                        따름이니라
                    </span>
                </p>

                <h2>
                    <span>정읍사</span>
                </h2>

                <p>
                    <span>달하 노피곰 도드샤</span>
                </p>

                <p>
                    <span>어긔야 머리곰 비취오시라</span>
                </p>

                <p>
                    <span>어긔야 어강됴리</span>
                </p>

                <p>
                    <span>아으 다롱디리</span>
                </p>

                <p>
                    <span>져재 녀러신고요</span>
                </p>

                <p>
                    <span>어긔야 즌데를 드듸욜셰라.</span>
                </p>

                <p>
                    <span>어긔야 어강됴리</span>
                </p>

                <p>
                    <span>어느이다 노코시라</span>
                </p>

                <p>
                    <span>어긔야 내 가논 데 졈그를셰라</span>
                </p>

                <p>
                    <span>어긔야 어강됴리</span>
                </p>

                <p>
                    <span>아으 다롱디리</span>
                </p>

                <h2>하여가</h2>

                <p>이렇게 하면 어떻고, 저렇게 하면 어떻하리요</p>

                <p>만수산 드렁 칡이 얽혀진들 어떻하리요</p>

                <p>우리도 이같이 얽혀서 백년까지 누리리라</p>

                <button className={styles.button} onClick={() => startApp()}>
                    Pick
                </button>
            </div>

            <TextPicker
                blocks={state.blocks}
                running={state.isRunning}
                onUpdateRunning={(isRunning) => setState({ isRunning })}
                onMove={(outline) => createBlock(outline)}
                onBlockClick={(_, index) => removeBlock(index)}
            />
        </>
    )
}

export default Example
