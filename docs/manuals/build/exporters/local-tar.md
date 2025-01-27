---
title: 로컬 및 tar 내보내기
keywords:
  - 빌드
  - buildx
  - buildkit
  - 내보내기
  - 로컬
  - tar
description: >
  로컬 및 tar 내보내기는 빌드 결과를 로컬 파일 시스템에 저장합니다.
aliases:
  - /build/building/exporters/local-tar/
---

`local` 및 `tar` 내보내기는 빌드 결과의 루트 파일 시스템을 로컬 디렉토리에 출력합니다. 이들은 컨테이너 이미지가 아닌 아티팩트를 생성하는 데 유용합니다.

- `local`은 파일 및 디렉토리를 내보냅니다.
- `tar`는 동일한 내용을 tarball로 묶어 내보냅니다.

## 개요 {#synopsis}

`local` 내보내기를 사용하여 컨테이너 이미지를 빌드합니다:

```bash
$ docker buildx build --output type=local[,parameters] .
$ docker buildx build --output type=tar[,parameters] .
```

다음 표는 사용 가능한 매개변수를 설명합니다:

| 매개변수    | 유형   | 기본값 | 설명                   |
| --------- | ------ | ------- | --------------------- |
| `dest`    | 문자열 |         | 파일을 복사할 경로     |

## 추가 읽기 {#further-reading}

`local` 또는 `tar` 내보내기에 대한 자세한 내용은 [BuildKit README](https://github.com/moby/buildkit/blob/master/README.md#local-directory)를 참조하십시오.
