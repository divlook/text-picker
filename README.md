# Text Picker (v1)

![Text Picker](/assets/icon@128.png)

## Description

📢 What's Text Picker

Text Picker는 웹 페이지에서 선택할 수 없는 텍스트를 쉽고 빠르게 추출할 수 있는 강력한 크롬 확장 앱입니다. 원하는 텍스트를 정확히 탐지하고, 직관적인 인터페이스를 통해 누구나 손쉽게 사용할 수 있습니다.

가이드 영역을 통해 원하는 텍스트를 정확히 찾아내고 복사할 수 있습니다. 예를 들어, 복사할 수 없는 웹 페이지의 기사 제목이나 중요한 데이터를 손쉽게 추출할 때 유용합니다.


✨ 주요 기능


1. 가이드 영역 선택
   - 텍스트 추출이 필요한 부분을 클릭하여 가이드 박스를 생성합니다.
   - 영역 크기와 위치를 간단히 조정할 수 있습니다.
2. 원클릭 텍스트 추출
   - [Copy Text] 버튼을 눌러 선택된 텍스트를 복사합니다.


🚀 사용 방법

1. Chrome 툴바에서 Text Picker 아이콘을 클릭합니다.
2. 마우스로 텍스트 추출 영역을 선택하고, 가이드 영역을 조정합니다.
3. [Copy Text] 버튼을 클릭해 텍스트를 복사합니다.
4. 작업이 끝나면 [Quit] 버튼을 눌러 종료합니다.


⚠️ 주의사항

- DOM 구조가 비정상적일 경우, 일부 텍스트를 제대로 탐지하지 못할 수 있습니다.


🔗 바로가기

- Chrome 웹 스토어 : https://chrome.google.com/webstore/detail/folgepnhffdkhbdhgclkjmhggijlngmi
- GitHub Repo : https://github.com/divlook/text-picker
- 의견 및 문의사항 : https://github.com/divlook/text-picker/discussions


## Structure

- `modules/core`: 핵심 로직과 공통 유틸리티가 포함된 모듈입니다.
- `modules/v1`: Text Picker v1 버전의 기능과 관련된 모듈입니다.
- `modules-deprecated`: 더 이상 사용되지 않는 모듈이 보관된 디렉토리입니다.


## Development

### Setup

```bash
nvm use
npm i -g pnpm
pnpm i
```

### Develop UI

스토리북이 실행되며 UI 개발을 할 수 있습니다.

```bash
pnpm run ui # http://localhost:6006/
```

### Develop Chrome extension

파일이 변경될 때마다 `modules/v1/release/text-picker@*.*.*` 디렉토리에 Chrome 확장앱 소스가 빌드됩니다. Chrome과 연결하여 개발할 수 있습니다.

```bash
pnpm run dev
```

### Build Chrome extension

`modules/v1/release/text-picker@*.*.*` 디렉토리에 Chrome 확장앱 소스가 빌드됩니다.

```bash
pnpm run build
```

### Versioning

```bash
pnpm --filter v1 exec pnpm version [<newversion> | major | minor | patch]
```

### ETC

```bash
pnpm run lint
pnpm run format
```
