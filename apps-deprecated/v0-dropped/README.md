# Text Picker (Beta)

![Text Picker](/public/icon@128.png)

## Description

### 📢 What's Text Picker

[Text Picker]는 웹 페이지에서 선택할 수 없는 영역의 텍스트를 추출하기 위한 크롬 확장 앱입니다.
[DOM](https://developer.mozilla.org/ko/docs/Web/API/Document_Object_Model/Introduction)을 분석하여 가이드 영역에 위치한 [Element](https://developer.mozilla.org/ko/docs/Web/API/Element)들을 찾고 텍스트 내용을 추출할 수 있습니다.


### 📌 사용 방법

- 툴바에서 [Text Picker] 아이콘을 클릭하세요.
- 텍스트를 추출하고 싶은 영역의 시작지점과 끝지점을 마우스로 클릭해서 가이드 영역을 만드세요.
- 마우스를 활용해서 가이드 영역을 세밀하게 조정하세요.
- 가이드 영역의 우측 하단에 있는 [Copy], [Translate] 버튼을 클릭해서 텍스트를 추출하세요.
- [Close] 버튼 또는 가이드 영역의 밖을 클릭해서 [Text Picker]를 종료할 수 있습니다.


### ⚠️ 주의사항

- DOM 트리 구조가 자연스럽지 못한 경우 Element를 제대로 탐색하지 못할 수 있습니다.
- DOM 트리 구조가 과도하게 복잡한 경우 성능 문제가 발생할 수 있습니다.


### 🔗 바로가기

- [Chrome 웹 스토어](https://chrome.google.com/webstore/detail/folgepnhffdkhbdhgclkjmhggijlngmi)
- [GitHub Repo](https://github.com/divlook/text-picker)
- [의견 및 문의사항](https://github.com/divlook/text-picker/discussions)

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

파일이 변경될 때마다 `release/text-picker@*.*.*` 디렉토리에 Chrome 확장앱 소스가 빌드됩니다. Chrome과 연결하여 개발할 수 있습니다.

```bash
pnpm run chrome
```

### Build Chrome extension

`release/text-picker@*.*.*` 디렉토리에 Chrome 확장앱 소스가 빌드됩니다.

```bash
pnpm run chrome:build
```
