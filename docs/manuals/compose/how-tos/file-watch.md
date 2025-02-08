---
description: 파일 감시를 사용하여 작업 중 실행 중인 서비스를 자동으로 업데이트
keywords:
  - 컴포즈
  - 파일 감시
  - 실험적
title: 컴포즈 감시 사용
weight: 50
aliases:
  - /compose/file-watch/
---

`watch` 속성은 코드를 편집하고 저장할 때 실행 중인 Compose 서비스를 자동으로 업데이트하고 미리 보기 기능을 제공합니다. 이를 통해 많은 프로젝트에서 Compose가 실행된 후 별도의 조작 없이도 개발이 가능하며, 작업을 저장할 때마다 서비스가 자동으로 갱신됩니다.

`watch`는 다음 파일 경로 규칙을 따릅니다:

- 모든 경로는 프로젝트 디렉토리를 기준으로 합니다.
- 디렉토리는 재귀적으로 감시됩니다.
- 글롭 패턴은 지원되지 않습니다.
- `.dockerignore`의 규칙이 적용됩니다.
  - 추가로 무시할 경로를 정의하려면 `ignore` 옵션을 사용하세요 (동일한 구문)
  - 일반적인 IDE(Vim, Emacs, JetBrains 등)의 임시/백업 파일은 자동으로 무시됩니다.
  - `.git` 디렉토리는 자동으로 무시됩니다.

컴포즈 프로젝트의 모든 서비스에 대해 `watch`를 켤 필요는 없습니다. 일부 프로젝트, 예를 들어 자바스크립트 프론트엔드만 자동 업데이트에 적합할 수 있습니다.

컴포즈 감시는 `build` 속성을 사용하여 로컬 소스 코드에서 빌드된 서비스와 함께 작동하도록 설계되었습니다. 사전 빌드된 이미지를 사용하는 서비스는 변경 사항을 추적하지 않습니다.

## 컴포즈 감시 대 바인드 마운트 {#compose-watch-versus-bind-mounts}

컴포즈는 호스트 디렉토리를 서비스 컨테이너 내부에 공유하는 것을 지원합니다. 감시 모드는 이 기능을 대체하지 않으며, 컨테이너 환경에서 개발할 때 더욱 유용한 보완 기능으로 작동합니다.

더 중요한 것은, `watch`는 바인드 마운트로는 효과적으로 다룰 수 없는 더 세밀한 제어를 허용합니다. 감시 규칙을 사용하면 감시 트리 내의 특정 파일이나 전체 디렉토리를 무시할 수 있습니다.

예를 들어, 자바스크립트 프로젝트에서 `node_modules/` 디렉토리를 무시하는 것은 두 가지 이점이 있습니다:

- **성능**: 많은 작은 파일이 있는 파일 트리는 일부 구성에서 높은 I/O 부하를 유발할 수 있습니다.
- **다중 플랫폼**: 호스트 OS 또는 아키텍처가 컨테이너와 다를 경우 컴파일된 아티팩트를 공유할 수 없습니다.

예를 들어, Node.js 프로젝트에서는 `node_modules/` 디렉토리를 동기화하지 않는 것이 좋습니다. 자바스크립트는 인터프리터 언어이지만, `npm` 패키지에는 플랫폼 간에 이식할 수 없는 네이티브 코드(컴파일되어 특정 운영체제와 아키텍처에서 직접 실행되는 코드)가 포함될 수 있습니다.

## 구성 {#configuration}

`watch` 속성은 로컬 파일 변경에 따라 자동 서비스 업데이트를 제어하는 규칙 목록을 정의합니다.

각 규칙에는 수정이 감지되었을 때 수행할 `path` 패턴과 `action`이 필요합니다. `watch`에는 두 가지 가능한 작업이 있으며, 작업에 따라 추가 필드가 허용되거나 필요할 수 있습니다.

감시 모드는 다양한 언어와 프레임워크에서 사용할 수 있습니다.
특정 경로와 규칙은 프로젝트마다 다르지만, 개념은 동일합니다.

### 사전 요구 사항 {#prerequisites}

`watch`가 제대로 작동하려면 일반적인 실행 파일이 필요합니다. 서비스 이미지에 다음 바이너리가 포함되어 있는지 확인하세요:

- stat
- mkdir
- rmdir

`watch`는 또한 컨테이너의 `USER`가 파일을 업데이트할 수 있도록 대상 경로에 쓸 수 있어야 합니다. 일반적인 패턴은 Dockerfile의 `COPY` 명령을 사용하여 초기 콘텐츠를 컨테이너에 복사하는 것입니다. 이러한 파일이 구성된 사용자에 의해 소유되도록 하려면 `COPY --chown` 플래그를 사용하세요:

```dockerfile
# 권한이 없는 루트 사용자가 아니라, 권한이 제한된 사용자(app)로 실행
FROM node:18
RUN useradd -ms /bin/sh -u 1001 app
USER app

# 종속성 설치
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# 소스 파일 복사 (권한 설정)
COPY --chown=app:app . /app
```

### `action` {#action}

#### #sync

`action`이 `sync`로 설정된 경우, 컴포즈는 호스트의 파일 변경 사항이 서비스 컨테이너 내의 해당 파일과 자동으로 일치하도록 합니다.

`sync`는 "핫 리로드" 또는 동등한 기능을 지원하는 프레임워크에 이상적입니다.

더 일반적으로, `sync` 규칙은 많은 개발 사용 사례에서 바인드 마운트를 대신하여 사용할 수 있습니다.

#### rebuild

`action`이 `rebuild`로 설정된 경우, 컴포즈는 BuildKit을 사용하여 새 이미지를 자동으로 빌드하고 실행 중인 서비스 컨테이너를 교체합니다.

동작은 `docker compose up --build <svc>`를 실행하는 것과 동일합니다.

재빌드는 컴파일된 언어에 이상적이거나 특정 파일의 수정에 대한 대체로 전체 이미지 재빌드가 필요한 경우 (예: `package.json`).

#### sync-restart

`action`이 `sync+restart`로 설정된 경우, 컴포즈는 변경 사항을 서비스 컨테이너와 동기화하고 재시작합니다.

`sync+restart`는 구성 파일 변경 시 이상적이며, 이미지를 재빌드할 필요는 없지만 서비스 컨테이너의 주요 프로세스를 재시작해야 하는 경우에 적합합니다.
예를 들어 데이터베이스 구성이나 `nginx.conf` 파일을 업데이트할 때 잘 작동합니다.

:::tip
[이미지 레이어 캐싱](/build/cache) 및 [다중 단계 빌드](/build/building/multi-stage/)를 통해
빠른 증분 재빌드를 위해 Dockerfile을 최적화하세요.
:::

### `path` 및 `target` {#path-and-target}

`target` 필드는 경로가 컨테이너에 어떻게 매핑되는지를 제어합니다.

`path: ./app/html` 및 `./app/html/index.html`의 변경 사항에 대해:

- `target: /app/html` -> `/app/html/index.html`
- `target: /app/static` -> `/app/static/index.html`
- `target: /assets` -> `/assets/index.html`

## 예제 1 {#example-1}

이 최소 예제는 다음 구조를 가진 Node.js 애플리케이션을 대상으로 합니다:

```text
myproject/
├── web/
│   ├── App.jsx
│   └── index.js
├── Dockerfile
├── compose.yaml
└── package.json
```

```yaml
services:
  web:
    build: .
    command: npm start
    develop:
      watch:
        - action: sync
          path: ./web
          target: /src/web
          ignore:
            - node_modules/
        - action: rebuild
          path: package.json
```

이 예제에서 `docker compose up --watch`를 실행하면 프로젝트 루트의 `Dockerfile`에서 빌드된 이미지를 사용하여 `web` 서비스의 컨테이너가 시작됩니다.
`web` 서비스는 명령으로 `npm start`를 실행하여 번들러(웹팩, Vite, Turbopack 등)에서 핫 모듈 리로드가 활성화된 애플리케이션의 개발 버전을 시작합니다.

서비스가 시작된 후, 감시 모드는 대상 디렉토리와 파일을 모니터링하기 시작합니다.
그런 다음 `web/` 디렉토리의 소스 파일이 변경될 때마다 컴포즈는 파일을 컨테이너 내부의 `/src/web`의 해당 위치로 동기화합니다.
예를 들어, `./web/App.jsx`는 `/src/web/App.jsx`로 복사됩니다.

복사된 후, 번들러는 재시작 없이 실행 중인 애플리케이션을 업데이트합니다.

소스 코드 파일과 달리, 새로운 종속성을 추가하는 것은 즉시 할 수 없으므로 `package.json`이 변경될 때마다 컴포즈는 이미지를 재빌드하고 `web` 서비스 컨테이너를 다시 생성합니다.

이 패턴은 Flask를 사용하는 Python과 같은 많은 언어와 프레임워크에 적용할 수 있습니다. Python 소스 파일은 동기화할 수 있지만 `requirements.txt`의 변경은 재빌드를 트리거해야 합니다.

## 예제 2 {#example-2}

이전 예제를 수정하여 `sync+restart`를 보여줍니다:

```yaml
services:
  web:
    build: .
    command: npm start
    develop:
      watch:
        - action: sync
          path: ./web
          target: /app/web
          ignore:
            - node_modules/
        - action: sync+restart
          path: ./proxy/nginx.conf
          target: /etc/nginx/conf.d/default.conf

  backend:
    build:
      context: backend
      target: builder
```

이 설정은 프론트엔드 웹 서버와 백엔드 서비스를 가진 Node.js 애플리케이션을 효율적으로 개발하고 테스트하기 위해 Docker Compose에서 `sync+restart` 작업을 사용하는 방법을 보여줍니다. 이 구성은 애플리케이션 코드와 구성 파일의 변경 사항이 빠르게 동기화되고 적용되도록 하며, `web` 서비스는 변경 사항을 반영하기 위해 필요에 따라 재시작됩니다.

## 감시 사용 {#use-watch}

<Include file="compose/configure-watch.md" />

:::note
애플리케이션 로그와 (재)빌드 로그 및 파일 시스템 동기화 이벤트가 혼합되지 않도록 하려면 전용 `docker compose watch` 명령을 사용할 수도 있습니다.
:::

:::tip
Compose `watch`의 데모를 보려면 [`dockersamples/avatars`](https://github.com/dockersamples/avatars) 또는 [Docker 문서의 로컬 설정](https://github.com/docker/docs/blob/main/CONTRIBUTING.md)을 확인하세요.
:::

## 피드백 {#feedback}

이 기능에 대한 피드백을 적극적으로 받고 있습니다. [Compose Specification 저장소](https://github.com/compose-spec/compose-spec/pull/253)에서 피드백을 제공하거나 발견한 버그를 보고해주세요.

## 참고 {#reference}

- [Compose Develop Specification](/reference/compose-file/develop.md)
