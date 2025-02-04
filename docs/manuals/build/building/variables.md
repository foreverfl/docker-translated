---
title: 빌드 변수
linkTitle: Variables
weight: 20
description: 빌드 인수 및 환경 변수를 사용하여 빌드를 구성하는 방법
keywords:
  - 빌드
  - 인수
  - 변수
  - 매개변수
  - 환경 변수
  - 구성
aliases:
  - /build/buildkit/color-output-controls/
  - /build/building/env-vars/
  - /build/guide/build-args/
---

Docker 빌드에서 빌드 인수(`ARG`)와 환경 변수(`ENV`)는 모두 빌드 프로세스에 정보를 전달하는 수단으로 사용됩니다. 이를 사용하여 빌드를 매개변수화하여 더 유연하고 구성 가능한 빌드를 만들 수 있습니다.

:::warning
빌드 인수 및 환경 변수는 빌드에 보안 정보를 전달하는 데 부적합합니다. 최종 이미지에 노출되기 때문입니다. 대신 보안 정보 마운트 또는 SSH 마운트를 사용하여 빌드에 보안 정보를 안전하게 노출하십시오.

자세한 내용은 [빌드 보안 정보](./secrets.md)을 참조하십시오.
:::

## 유사점과 차이점 {#similarities-and-differences}

빌드 인수와 환경 변수는 유사합니다. 둘 다 Dockerfile에 선언되며 `docker build` 명령의 플래그를 사용하여 설정할 수 있습니다. 둘 다 빌드를 매개변수화하는 데 사용할 수 있습니다. 그러나 각각은 고유한 목적을 가지고 있습니다.

### 빌드 인수 {#build-arguments}

빌드 인수는 Dockerfile 자체의 변수입니다. 이를 사용하여 Dockerfile 명령의 값을 매개변수화할 수 있습니다. 예를 들어, 빌드 인수를 사용하여 설치할 종속성의 버전을 지정할 수 있습니다.

빌드 인수는 명령에서 사용되지 않는 한 빌드에 영향을 미치지 않습니다. Dockerfile에서 이미지 파일 시스템이나 구성으로 명시적으로 전달되지 않는 한 컨테이너에서 접근하거나 존재하지 않습니다. 이미지 메타데이터, 출처 증명 및 이미지 기록에 지속될 수 있으므로 보안 정보를를 보유하는 데 적합하지 않습니다.

Dockerfile을 더 유연하고 유지 관리하기 쉽게 만듭니다.

빌드 인수를 사용하는 예제는 [`ARG` 사용 예제](#arg-usage-example)를 참조하십시오.

### 환경 변수 {#environment-variables}

환경 변수는 빌드 실행 환경에 전달되며, 이미지에서 생성된 컨테이너에 지속됩니다.

환경 변수는 주로 다음 용도로 사용됩니다:

- 빌드 실행 환경 구성
- 컨테이너의 기본 환경 변수 설정

환경 변수가 설정된 경우 빌드 실행 및 애플리케이션의 동작이나 구성을 직접적으로 영향을 미칠 수 있습니다.

빌드 시간에 환경 변수를 재정의하거나 설정할 수 없습니다. 환경 변수의 값은 Dockerfile에 선언되어야 합니다. 환경 변수와 빌드 인수를 결합하여 빌드 시간에 환경 변수를 구성할 수 있습니다.

빌드를 구성하기 위해 환경 변수를 사용하는 예제는 [`ENV` 사용 예제](#env-usage-example)를 참조하십시오.

## `ARG` 사용 예제 {#arg-usage-example}

빌드 인수는 일반적으로 빌드에 사용되는 이미지 변형 또는 패키지 버전과 같은 구성 요소의 버전을 지정하는 데 사용됩니다.

버전을 빌드 인수로 지정하면 Dockerfile을 수동으로 업데이트하지 않고도 다른 버전으로 빌드할 수 있습니다. 또한 Dockerfile을 유지 관리하기 쉽게 만듭니다. 파일 상단에 버전을 선언할 수 있기 때문입니다.

빌드 인수는 여러 곳에서 값을 재사용하는 방법이 될 수도 있습니다. 예를 들어, 빌드에서 여러 가지 `alpine` 버전을 사용하는 경우, 모든 곳에서 동일한 `alpine` 버전을 사용하도록 할 수 있습니다:

- `golang:1.22-alpine${ALPINE_VERSION}`
- `python:3.12-alpine${ALPINE_VERSION}`
- `nginx:1-alpine${ALPINE_VERSION}`

다음 예제는 빌드 인수를 사용하여 `node`와 `alpine`의 버전을 정의합니다.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS base
WORKDIR /src

FROM base AS build
COPY package*.json ./
RUN npm ci
RUN npm run build

FROM base AS production
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /src/dist/ .
CMD ["node", "app.js"]
```

이 경우, 빌드 인수는 기본값을 가지고 있습니다. 빌드를 호출할 때 값을 지정하는 것은 선택 사항입니다. 기본값을 재정의하려면 `--build-arg` CLI 플래그를 사용하십시오:

```bash
$ docker build --build-arg NODE_VERSION=current .
```

빌드 인수를 사용하는 방법에 대한 자세한 내용은 다음을 참조하십시오:

- [`ARG` Dockerfile 참조](/reference/dockerfile.md#arg)
- [`docker build --build-arg` 참조](/reference/cli/docker/buildx/build.md#build-arg)

## `ENV` 사용 예제 {#env-usage-example}

`ENV`로 환경 변수를 선언하면 빌드 단계의 모든 후속 명령에서 변수를 사용할 수 있습니다. 다음 예제는 `NODE_ENV`를 `production`으로 설정한 후 JavaScript 종속성을 `npm`으로 설치하는 예제입니다. 변수를 설정하면 `npm`이 로컬 개발에만 필요한 패키지를 생략합니다.

```dockerfile
# syntax=docker/dockerfile:1

FROM node:20
WORKDIR /app
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci && npm cache clean --force
COPY . .
CMD ["node", "app.js"]
```

환경 변수는 기본적으로 빌드 시간에 구성할 수 없습니다. 빌드 시간에 `ENV` 값을 변경하려면 환경 변수와 빌드 인수를 결합할 수 있습니다:

```dockerfile
# syntax=docker/dockerfile:1

FROM node:20
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
CMD ["node", "app.js"]
```

이 Dockerfile을 사용하면 `--build-arg`를 사용하여 `ENV`의 기본값을 재정의할 수 있습니다:

```bash
$ docker build --build-arg NODE_ENV=development .
```

설정한 환경 변수가 컨테이너에 지속되기 때문에 애플리케이션의 런타임에 의도하지 않은 부작용을 초래할 수 있습니다.

빌드에서 환경 변수를 사용하는 방법에 대한 자세한 내용은 다음을 참조하십시오:

- [`ENV` Dockerfile 참조](/reference/dockerfile.md#env)

## 범위 {#scoping}

Dockerfile의 전역 범위에 선언된 빌드 인수는 빌드 단계에 자동으로 상속되지 않습니다. 전역 범위에서만 접근할 수 있습니다.

```dockerfile
# syntax=docker/dockerfile:1

# 다음 빌드 인수는 전역 범위에서 선언되었습니다:
ARG NAME="joe"

FROM alpine
# 다음 명령은 $NAME 빌드 인수에 접근할 수 없습니다.
# 인수가 이 단계에 대해 정의되지 않았기 때문입니다.
RUN echo "hello ${NAME}!"
```

이 예제에서 `echo` 명령은 `hello !`로 평가됩니다. `NAME` 빌드 인수의 값이 범위를 벗어났기 때문입니다. 전역 빌드 인수를 단계에 상속하려면 이를 소비해야 합니다:

```dockerfile
# syntax=docker/dockerfile:1

# 전역 범위에서 빌드 인수를 선언합니다
ARG NAME="joe"

FROM alpine
# 빌드 단계에서 빌드 인수를 소비합니다
ARG NAME
RUN echo $NAME
```

빌드 인수가 단계에서 선언되거나 소비되면 자식 단계에 자동으로 상속됩니다.

```dockerfile
# syntax=docker/dockerfile:1
FROM alpine AS base
# 빌드 단계에서 빌드 인수를 선언합니다
ARG NAME="joe"

# "base"를 기반으로 새 단계를 만듭니다
FROM base AS build
# NAME 빌드 인수는 여기에서 사용할 수 있습니다.
# 부모 단계에서 선언되었기 때문입니다.
RUN echo "hello $NAME!"
```

다음 다이어그램은 다단계 빌드에서 빌드 인수 및 환경 변수 상속이 어떻게 작동하는지 추가로 설명합니다.

<!-- {{< figure src="../../images/build-variables.svg" class="invertible" >}} -->

## 사전 정의된 빌드 인수 {#pre-defined-build-arguments}

이 섹션에서는 기본적으로 모든 빌드에 사용할 수 있는 사전 정의된 빌드 인수에 대해 설명합니다.

### 다중 플랫폼 빌드 인수 {#multi-platform-build-arguments}

다중 플랫폼 빌드 인수는 빌드의 빌드 및 대상 플랫폼을 설명합니다.

빌드 플랫폼은 빌더(BuildKit 데몬)가 실행되는 호스트 시스템의 운영 체제, 아키텍처 및 플랫폼 변형입니다.

- `BUILDPLATFORM`
- `BUILDOS`
- `BUILDARCH`
- `BUILDVARIANT`

대상 플랫폼 인수는 빌드의 대상 플랫폼에 대해 동일한 값을 보유하며, `docker build` 명령의 `--platform` 플래그를 사용하여 지정됩니다.

- `TARGETPLATFORM`
- `TARGETOS`
- `TARGETARCH`
- `TARGETVARIANT`

이러한 인수는 다중 플랫폼 빌드에서 교차 컴파일을 수행하는 데 유용합니다. Dockerfile의 전역 범위에서 사용할 수 있지만 빌드 단계에 자동으로 상속되지 않습니다. 단계 내에서 사용하려면 선언해야 합니다:

```dockerfile
# syntax=docker/dockerfile:1

# 사전 정의된 빌드 인수는 전역 범위에서 사용할 수 있습니다
FROM --platform=$BUILDPLATFORM golang
# 단계에 상속하려면 ARG로 선언하십시오
ARG TARGETOS
RUN GOOS=$TARGETOS go build -o ./exe .
```

다중 플랫폼 빌드 인수에 대한 자세한 내용은 [다중 플랫폼 인수](/reference/dockerfile.md#automatic-platform-args-in-the-global-scope)를 참조하십시오.

### 프록시 인수 {#proxy-arguments}

프록시 빌드 인수를 사용하면 빌드에 사용할 프록시를 지정할 수 있습니다. Dockerfile에서 이러한 인수를 선언하거나 참조할 필요가 없습니다. `--build-arg`로 프록시를 지정하는 것만으로 빌드에서 프록시를 사용하게 됩니다.

프록시 인수는 기본적으로 빌드 캐시 및 `docker history` 출력에서 자동으로 제외됩니다. Dockerfile에서 인수를 참조하면 프록시 구성이 빌드 캐시에 포함됩니다.

빌더는 다음 프록시 빌드 인수를 존중합니다. 변수는 대소문자를 구분하지 않습니다.

- `HTTP_PROXY`
- `HTTPS_PROXY`
- `FTP_PROXY`
- `NO_PROXY`
- `ALL_PROXY`

빌드에 프록시를 구성하려면:

```bash
$ docker build --build-arg HTTP_PROXY=https://my-proxy.example.com .
```

프록시 빌드 인수에 대한 자세한 내용은 [프록시 인수](/reference/dockerfile.md#predefined-args)를 참조하십시오.

## 빌드 도구 구성 변수 {#build-tool-configuration-variables}

다음 환경 변수는 Buildx 및 BuildKit의 동작을 활성화, 비활성화 또는 변경합니다. 이러한 변수는 빌드 컨테이너를 구성하는 데 사용되지 않습니다. 빌드 내부에서 사용할 수 없으며 `ENV` 명령과 관련이 없습니다. Buildx 클라이언트 또는 BuildKit 데몬을 구성하는 데 사용됩니다.

| 변수                                                                      | 유형              | 설명                                                  |
| --------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------ |
| [BUILDKIT_COLORS](#buildkit_colors)                                         | 문자열            | 터미널 출력의 텍스트 색상을 구성합니다.                |
| [BUILDKIT_HOST](#buildkit_host)                                             | 문자열            | 원격 빌더에 사용할 호스트를 지정합니다.                     |
| [BUILDKIT_PROGRESS](#buildkit_progress)                                     | 문자열            | 진행 상황 출력 유형을 구성합니다.                           |
| [BUILDKIT_TTY_LOG_LINES](#buildkit_tty_log_lines)                           | 문자열            | TTY 모드에서 활성 단계의 로그 라인 수를 지정합니다.          |
| [BUILDX_BAKE_GIT_AUTH_HEADER](#buildx_bake_git_auth_header)                 | 문자열            | 원격 Bake 파일에 대한 HTTP 인증 스킴을 지정합니다.            |
| [BUILDX_BAKE_GIT_AUTH_TOKEN](#buildx_bake_git_auth_token)                   | 문자열            | 원격 Bake 파일에 대한 HTTP 인증 토큰을 지정합니다.             |
| [BUILDX_BAKE_GIT_SSH](#buildx_bake_git_ssh)                                 | 문자열            | 원격 Bake 파일에 대한 SSH 인증을 지정합니다.                    |
| [BUILDX_BUILDER](#buildx_builder)                                           | 문자열            | 사용할 빌더 인스턴스를 지정합니다.                         |
| [BUILDX_CONFIG](#buildx_config)                                             | 문자열            | 구성, 상태 및 로그의 위치를 지정합니다.         |
| [BUILDX_CPU_PROFILE](#buildx_cpu_profile)                                   | 문자열            | 지정된 위치에 `pprof` CPU 프로파일을 생성합니다.    |
| [BUILDX_EXPERIMENTAL](#buildx_experimental)                                 | 부울           | 실험적 기능을 활성화합니다.                               |
| [BUILDX_GIT_CHECK_DIRTY](#buildx_git_check_dirty)                           | 부울           | 더러운 Git 체크아웃 감지를 활성화합니다.                         |
| [BUILDX_GIT_INFO](#buildx_git_info)                                         | 부울           | 출처 증명에서 Git 정보를 제거합니다.           |
| [BUILDX_GIT_LABELS](#buildx_git_labels)                                     | 문자열 \| 부울 | 이미지에 Git 출처 레이블을 추가합니다.                         |
| [BUILDX_MEM_PROFILE](#buildx_mem_profile)                                   | 문자열            | 지정된 위치에 `pprof` 메모리 프로파일을 생성합니다. |
| [BUILDX_NO_DEFAULT_ATTESTATIONS](#buildx_no_default_attestations)           | 부울           | 기본 출처 증명을 비활성화합니다.                    |
| [BUILDX_NO_DEFAULT_LOAD](#buildx_no_default_load)                           | 부울           | 기본적으로 이미지 스토어에 이미지를 로드하지 않습니다.           |
| [EXPERIMENTAL_BUILDKIT_SOURCE_POLICY](#experimental_buildkit_source_policy) | 문자열            | BuildKit 소스 정책 파일을 지정합니다.                       |

BuildKit은 몇 가지 추가 구성 매개변수도 지원합니다. 자세한 내용은 [BuildKit 내장 빌드 인수](/reference/dockerfile.md#buildkit-built-in-build-args)를 참조하십시오.

환경 변수에 대한 부울 값을 여러 가지 방법으로 표현할 수 있습니다. 예를 들어, `true`, `1`, 및 `T`는 모두 true로 평가됩니다. 평가는 Go 표준 라이브러리의 `strconv.ParseBool` 함수를 사용하여 수행됩니다. 자세한 내용은 [참조 문서](https://pkg.go.dev/strconv#ParseBool)를 참조하십시오.

<!-- vale Docker.HeadingSentenceCase = NO -->

### BUILDKIT_COLORS {#buildkit_colors}

터미널 출력의 색상을 변경합니다. `BUILDKIT_COLORS`를 다음 형식의 CSV 문자열로 설정하십시오:

```bash
$ export BUILDKIT_COLORS="run=123,20,245:error=yellow:cancel=blue:warning=white"
```

색상 값은 유효한 RGB 16진수 코드 또는 [BuildKit 사전 정의 색상](https://github.com/moby/buildkit/blob/master/util/progress/progressui/colors.go) 중 하나일 수 있습니다.

`NO_COLOR`를 설정하면 색상화된 출력이 꺼집니다. 이는 [no-color.org](https://no-color.org/)에서 권장하는 방식입니다.

### BUILDKIT_HOST {#buildkit_host}

`BUILDKIT_HOST`를 사용하여 원격 빌더로 사용할 BuildKit 데몬의 주소를 지정합니다. 이는 `docker buildx create`의 위치 인수로 주소를 지정하는 것과 동일합니다.

사용법:

```bash
$ export BUILDKIT_HOST=tcp://localhost:1234
$ docker buildx create --name=remote --driver=remote
```

`BUILDKIT_HOST` 환경 변수와 위치 인수를 모두 지정하면 인수가 우선합니다.

### BUILDKIT_PROGRESS {#buildkit_progress}

BuildKit 진행 상황 출력 유형을 설정합니다. 유효한 값은 다음과 같습니다:

- `auto` (기본값)
- `plain`
- `tty`
- `quiet`
- `rawjson`

사용법:

```bash
$ export BUILDKIT_PROGRESS=plain
```

### BUILDKIT_TTY_LOG_LINES {#buildkit_tty_log_lines}

TTY 모드에서 활성 단계의 로그 라인 수를 변경하려면 `BUILDKIT_TTY_LOG_LINES`를 숫자로 설정하십시오 (기본값은 `6`).

```bash
$ export BUILDKIT_TTY_LOG_LINES=8
```

### EXPERIMENTAL_BUILDKIT_SOURCE_POLICY {#experimental_buildkit_source_policy}

BuildKit 소스 정책 파일을 지정하여 고정된 종속성을 사용하여 재현 가능한 빌드를 생성할 수 있습니다.

```bash
$ export EXPERIMENTAL_BUILDKIT_SOURCE_POLICY=./policy.json
```

예제:

```json
{
  "rules": [
    {
      "action": "CONVERT",
      "selector": {
        "identifier": "docker-image://docker.io/library/alpine:latest"
      },
      "updates": {
        "identifier": "docker-image://docker.io/library/alpine:latest@sha256:4edbd2beb5f78b1014028f4fbb99f3237d9561100b6881aabbf5acce2c4f9454"
      }
    },
    {
      "action": "CONVERT",
      "selector": {
        "identifier": "https://raw.githubusercontent.com/moby/buildkit/v0.10.1/README.md"
      },
      "updates": {
        "attrs": {
          "http.checksum": "sha256:6e4b94fc270e708e1068be28bd3551dc6917a4fc5a61293d51bb36e6b75c4b53"
        }
      }
    },
    {
      "action": "DENY",
      "selector": {
        "identifier": "docker-image://docker.io/library/golang*"
      }
    }
  ]
}
```

### BUILDX_BAKE_GIT_AUTH_HEADER

원격 Bake 정의를 사용할 때 원격 Git 저장소에 대한 HTTP 인증 스킴을 설정합니다.
이는 [`GIT_AUTH_HEADER` 보안 정보](./secrets#http-authentication-scheme)과 동일하지만, 원격 Bake 파일을 로드할 때 Bake에서 사전 인증을 용이하게 합니다.
지원되는 값은 `bearer`(기본값) 및 `basic`입니다.

사용법:

```bash
$ export BUILDX_BAKE_GIT_AUTH_HEADER=basic
```

### BUILDX_BAKE_GIT_AUTH_TOKEN

원격 Bake 정의를 사용할 때 원격 Git 저장소에 대한 HTTP 인증 토큰을 설정합니다.
이는 [`GIT_AUTH_TOKEN` 보안 정보](./secrets#git-authentication-for-remote-contexts)과 동일하지만, 원격 Bake 파일을 로드할 때 Bake에서 사전 인증을 용이하게 합니다.

사용법:

```bash
$ export BUILDX_BAKE_GIT_AUTH_TOKEN=$(cat git-token.txt)
```

### BUILDX_BAKE_GIT_SSH

원격 Bake 정의를 사용할 때 원격 Git 서버에 인증하기 위해 Bake에 전달할 SSH 에이전트 소켓 파일 경로 목록을 지정할 수 있습니다.
이는 빌드용 SSH 마운트와 유사하지만, 빌드 정의를 해결할 때 Bake에서 사전 인증을 용이하게 합니다.

이 환경 변수를 설정하는 것은 일반적으로 필요하지 않습니다. Bake는 기본적으로 `SSH_AUTH_SOCK` 에이전트 소켓을 사용합니다.
다른 파일 경로의 소켓을 사용하려는 경우에만 이 변수를 지정해야 합니다.
이 변수는 쉼표로 구분된 문자열을 사용하여 여러 경로를 받을 수 있습니다.

사용법:

```bash
$ export BUILDX_BAKE_GIT_SSH=/run/foo/listener.sock,~/.creds/ssh.sock
```

### BUILDX_BUILDER

구성된 빌더 인스턴스를 재정의합니다. `docker buildx --builder` CLI 플래그와 동일합니다.

사용법:

```bash
$ export BUILDX_BUILDER=my-builder
```

### BUILDX_CONFIG

`BUILDX_CONFIG`를 사용하여 빌드 구성, 상태 및 로그에 사용할 디렉토리를 지정할 수 있습니다. 이 디렉토리의 조회 순서는 다음과 같습니다:

- `$BUILDX_CONFIG`
- `$DOCKER_CONFIG/buildx`
- `~/.docker/buildx` (기본값)

사용법:

```bash
$ export BUILDX_CONFIG=/usr/local/etc
```

### BUILDX_CPU_PROFILE

지정된 위치에 `pprof` CPU 프로파일을 생성합니다.

> [!NOTE]
> 이 속성은 Buildx를 개발할 때만 유용합니다. 프로파일링 데이터는 빌드 성능을 분석하는 데 관련이 없습니다.

사용법:

```bash
$ export BUILDX_CPU_PROFILE=buildx_cpu.prof
```

### BUILDX_EXPERIMENTAL

실험적 빌드 기능을 활성화합니다.

사용법:

```bash
$ export BUILDX_EXPERIMENTAL=1
```

### BUILDX_GIT_CHECK_DIRTY

true로 설정하면 출처 증명에 대한 Git 정보에서 더러운 상태를 감지합니다.

사용법:

```bash
$ export BUILDX_GIT_CHECK_DIRTY=1
```

### BUILDX_GIT_INFO

false로 설정하면 출처 증명에서 Git 정보를 제거합니다.

사용법:

```bash
$ export BUILDX_GIT_INFO=0
```

### BUILDX_GIT_LABELS

Git 정보를 기반으로 이미지를 빌드할 때 출처 레이블을 추가합니다. 레이블은 다음과 같습니다:

- `com.docker.image.source.entrypoint`: 프로젝트 루트에 대한 Dockerfile의 위치
- `org.opencontainers.image.revision`: Git 커밋 리비전
- `org.opencontainers.image.source`: 저장소의 SSH 또는 HTTPS 주소

예제:

```json
  "Labels": {
    "com.docker.image.source.entrypoint": "Dockerfile",
    "org.opencontainers.image.revision": "5734329c6af43c2ae295010778cd308866b95d9b",
    "org.opencontainers.image.source": "git@github.com:foo/bar.git"
  }
```

사용법:

- `BUILDX_GIT_LABELS=1`로 설정하여 `entrypoint` 및 `revision` 레이블을 포함합니다.
- `BUILDX_GIT_LABELS=full`로 설정하여 모든 레이블을 포함합니다.

저장소가 더러운 상태인 경우 `revision`에 `-dirty` 접미사가 추가됩니다.

### BUILDX_MEM_PROFILE

지정된 위치에 `pprof` 메모리 프로파일을 생성합니다.

> [!NOTE]
> 이 속성은 Buildx를 개발할 때만 유용합니다. 프로파일링 데이터는 빌드 성능을 분석하는 데 관련이 없습니다.

사용법:

```bash
$ export BUILDX_MEM_PROFILE=buildx_mem.prof
```

### BUILDX_NO_DEFAULT_ATTESTATIONS

기본적으로 BuildKit v0.11 이상은 빌드한 이미지에 출처 증명을 추가합니다. 기본 출처 증명을 비활성화하려면 `BUILDX_NO_DEFAULT_ATTESTATIONS=1`로 설정하십시오.

사용법:

```bash
$ export BUILDX_NO_DEFAULT_ATTESTATIONS=1
```

### BUILDX_NO_DEFAULT_LOAD

`docker` 드라이버를 사용하여 이미지를 빌드할 때 빌드가 완료되면 이미지가 자동으로 이미지 스토어에 로드됩니다. `BUILDX_NO_DEFAULT_LOAD`를 설정하여 이미지를 로컬 컨테이너 스토어에 자동으로 로드하지 않도록 합니다.

사용법:

```bash
$ export BUILDX_NO_DEFAULT_LOAD=1
```

<!-- vale Docker.HeadingSentenceCase = YES -->