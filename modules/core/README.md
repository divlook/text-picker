# README

## Usage

Only ES Module is supported.

```ts
import { type BoundingBoxSchema, pixel } from '@text-picker/core'
import { ThemeSchema } from '@text-picker/core/styling/const'
```

## 텍스트 탐색과 복사

`@text-picker/core/retriever`의 `Retriever`는 최상위 화면 기준의 선택 영역을 받습니다. `retrieve()`는 연속 요청을 지연 처리하고, `retrieveNow()`는 즉시 다시 탐색해 `RetrievalResult`를 반환합니다. 복사 버튼에서는 클릭 권한을 유지하도록 `retrieveNow()` 다음에 클립보드 쓰기를 호출합니다.

- `RetrievalResult.elements`: 선택된 요소.
- `RetrievalResult.rects`: 강조 표시용 최상위 화면 기준 사각형. 요소와 같은 순서입니다.
- `RetrievalResult.text`: 문장·개행·이미지 표현을 변환한 복사 내용.
- `on(callback)`: 탐색 결과 구독. 반환된 함수로 해당 구독만 해제할 수 있습니다.
- `clear()`: 예약된 탐색과 모든 구독을 정리합니다. 이후 다시 구독하고 사용할 수 있습니다.

탐색 결과는 캐시하지 않습니다. 접근 가능한 iframe의 좌표는 내부에서 변환하고, 접근 불가능한 iframe은 별도 알림 없이 건너뜁니다. 탐색은 선택 영역을 10픽셀 간격으로 확인하므로 영역이 커질수록 비용이 늘어납니다.

`@text-picker/core/clipboard`의 `copyText(text)`는 클립보드 쓰기 결과를 `code`와 `message`로 반환합니다. HTTPS 또는 localhost에서 사용하며, 두 번째 인자로 쓰기 함수를 주입해 성공·권한 거부 등의 결과를 검증할 수 있습니다.

## 회귀 테스트

저장소 루트에서 다음 명령을 실행합니다.

```bash
pnpm --filter @text-picker/core exec playwright install chromium --only-shell
pnpm test
```

브라우저 설치는 최초 실행 때와 Playwright 버전 변경 후에 필요합니다. `pnpm test`는 core를 빌드한 뒤 `test/core.test.js`를 실행합니다. 테스트는 내부 Implementation 대신 `Retriever`, `copyText()`, Chrome 리스너의 Interface를 호출하고, 실제 DOM의 결과와 클립보드 내용을 검증합니다. 외부 웹 페이지나 Storybook 서버는 필요하지 않습니다.
