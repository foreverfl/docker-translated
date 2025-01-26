---
description: CLI 및 로그 출력 형식 참조
keywords:
  - 형식
  - 포맷팅
  - 출력
  - 템플릿
  - 로그
title: 명령어 및 로그 출력 형식
weight: 40
aliases:
  - /engine/admin/formatting/
  - /config/formatting/
---

Docker는 특정 명령어 및 로그 드라이버의 출력 형식을 조작하는 데 사용할 수 있는 [Go 템플릿](https://golang.org/pkg/text/template/)을 지원합니다.

Docker는 템플릿 요소를 조작하기 위한 기본 함수 세트를 제공합니다.
이 모든 예제는 `docker inspect` 명령어를 사용하지만, 많은 다른 CLI 명령어에도 `--format` 플래그가 있으며, 많은 CLI 명령어 참조에는 출력 형식을 사용자 정의하는 예제가 포함되어 있습니다.

:::note
`--format` 플래그를 사용할 때는 셸 환경을 고려해야 합니다.
POSIX 셸에서는 다음을 단일 인용부호로 실행할 수 있습니다:

```console
$ docker inspect --format '{{join .Args " , "}}'
```
그렇지 않으면 Windows 셸(예: PowerShell)에서는 단일 인용부호를 사용해야 하지만,
매개변수 내부의 큰따옴표를 다음과 같이 이스케이프해야 합니다:

```console
$ docker inspect --format '{{join .Args \" , \"}}'
```
:::

## join {#join}

`join`은 문자열 목록을 연결하여 단일 문자열을 만듭니다.
목록의 각 요소 사이에 구분 기호를 넣습니다.

```console
$ docker inspect --format '{{join .Args " , "}}' container
```

## table {#table}

`table`은 출력에 표시할 필드를 지정합니다.

```console
$ docker image list --format "table {{.ID}}\t{{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

## json {#json}

`json`은 요소를 json 문자열로 인코딩합니다.

```console
$ docker inspect --format '{{json .Mounts}}' container
```

## lower {#lower}

`lower`는 문자열을 소문자로 변환합니다.

```console
$ docker inspect --format "{{lower .Name}}" container
```

## split {#split}

`split`은 문자열을 구분 기호로 나누어 문자열 목록으로 만듭니다.

```console
$ docker inspect --format '{{split .Image ":"}}' container
```

## title {#title}

`title`은 문자열의 첫 문자를 대문자로 변환합니다.

```console
$ docker inspect --format "{{title .Name}}" container
```

## upper {#upper}

`upper`는 문자열을 대문자로 변환합니다.

```console
$ docker inspect --format "{{upper .Name}}" container
```

## println {#println}

`println`은 각 값을 새 줄에 출력합니다.

```console
$ docker inspect --format='{{range .NetworkSettings.Networks}}{{println .IPAddress}}{{end}}' container
```

## Hint {#hint}

출력할 수 있는 데이터를 확인하려면 모든 내용을 json으로 표시하십시오:

```console
$ docker container ls --format='{{json .}}'
```
