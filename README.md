# Text Picker (v1)

![Text Picker](/assets/icon@128.png)

## Description

### 📢 What's Text Picker

[Text Picker]는 웹 페이지에서 선택할 수 없는 영역의 텍스트를 추출하기 위한 크롬 확장 앱입니다.
가이드 영역에서 텍스트를 찾아 클립보드에 저장합니다.


### 📌 사용 방법

- 툴바에서 [Text Picker] 아이콘을 클릭하세요.
- 가이드 영역에서 텍스트를 추출하고 싶은 영역으로 이동시키거나 크기를 조절하세요.
- [Copy text] 또는 [Copy HTML] 버튼을 클릭해서 텍스트를 추출하세요.
- [Quit] 버튼 또는 가이드 영역의 밖을 클릭해서 [Text Picker]를 종료할 수 있습니다.


### 🔗 바로가기

- [Chrome 웹 스토어](https://chrome.google.com/webstore/detail/folgepnhffdkhbdhgclkjmhggijlngmi)
- [GitHub Repo](https://github.com/divlook/text-picker)
- [의견 및 문의사항](https://github.com/divlook/text-picker/discussions)

## Development (수정 중)

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

### Versioning

```bash
pnpm --filter v1 exec pnpm version [<newversion> | major | minor | patch]
```
