---
title: 포트 게시 및 노출
keywords:
  - 개념
  - 빌드
  - 이미지
  - 컨테이너
  - 도커 데스크탑
description: 이 개념 페이지에서는 Docker에서 포트를 게시하고 노출하는 것의 중요성을 배웁니다.
weight: 1
aliases:
  - /guides/docker-concepts/running-containers/publishing-ports/
---

<YoutubeEmbed videoId="9JnqOmJ96ds" />

## 설명 {#Explanation}

지금까지 가이드를 따라왔다면, 컨테이너가 애플리케이션의 각 구성 요소에 대해 격리된 프로세스를 제공한다는 것을 이해했을 것입니다. React 프론트엔드, Python API, Postgres 데이터베이스와 같은 각 구성 요소는 호스트 머신의 다른 모든 것과 완전히 격리된 자체 샌드박스 환경에서 실행됩니다. 이러한 격리는 보안 및 종속성 관리에 좋지만, 직접 액세스할 수 없다는 것을 의미하기도 합니다. 예를 들어, 브라우저에서 웹 애플리케이션에 액세스할 수 없습니다.

이때 포트 게시가 필요합니다.

### 포트 게시 {#Publishing-ports}

포트를 게시하면 포워딩 규칙을 설정하여 네트워킹 격리를 약간 해제할 수 있습니다. 예를 들어, 호스트의 포트 `8080`으로 들어오는 요청을 컨테이너의 포트 `80`으로 포워딩하도록 설정할 수 있습니다. 포트 게시 작업은 `docker run` 명령어에서 `-p` (또는 `--publish`) 플래그를 사용하여 컨테이너를 생성할 때 수행됩니다. 구문은 다음과 같습니다:

```bash
$ docker run -d -p HOST_PORT:CONTAINER_PORT nginx
```

- `HOST_PORT`: 트래픽을 수신하려는 호스트 머신의 포트 번호
- `CONTAINER_PORT`: 연결을 수신 대기하는 컨테이너 내의 포트 번호

예를 들어, 컨테이너의 포트 `80`을 호스트 포트 `8080`에 게시하려면:

```bash
$ docker run -d -p 8080:80 nginx
```

이제 호스트 머신의 포트 `8080`으로 전송된 모든 트래픽이 컨테이너 내의 포트 `80`으로 포워딩됩니다.

:::important
포트가 게시되면 기본적으로 모든 네트워크 인터페이스에 게시됩니다. 이는 머신에 도달하는 모든 트래픽이 게시된 애플리케이션에 액세스할 수 있음을 의미합니다. 데이터베이스나 민감한 정보를 게시할 때 주의하십시오. [게시된 포트에 대해 자세히 알아보기](/engine/network/#published-ports).
:::

### 임시 포트에 게시 {#Publishing-to-ephemeral-ports}

때로는 포트를 게시하고 싶지만 호스트 포트가 무엇인지 신경 쓰지 않을 수 있습니다. 이 경우 Docker가 포트를 선택하도록 할 수 있습니다. 이를 위해 `HOST_PORT` 구성을 생략하면 됩니다.

예를 들어, 다음 명령어는 컨테이너의 포트 `80`을 호스트의 임시 포트에 게시합니다:

```bash
$ docker run -p 80 nginx
```

컨테이너가 실행되면, `docker ps` 명령어를 사용하여 선택된 포트를 확인할 수 있습니다:

```bash
docker ps
CONTAINER ID   IMAGE         COMMAND                  CREATED          STATUS          PORTS                    NAMES
a527355c9c53   nginx         "/docker-entrypoint.…"   4 seconds ago    Up 3 seconds    0.0.0.0:54772->80/tcp    romantic_williamson
```

이 예에서 애플리케이션은 호스트의 포트 `54772`에 노출됩니다.

### 모든 포트 게시 {#Publishing-all-ports}

컨테이너 이미지를 생성할 때, `EXPOSE` 지시어를 사용하여 패키지된 애플리케이션이 사용할 포트를 지정합니다. 이러한 포트는 기본적으로 게시되지 않습니다.

`-P` 또는 `--publish-all` 플래그를 사용하면 노출된 모든 포트를 임시 포트로 자동으로 게시할 수 있습니다. 이는 개발 또는 테스트 환경에서 포트 충돌을 피하려고 할 때 매우 유용합니다.

예를 들어, 다음 명령어는 이미지에 구성된 모든 노출된 포트를 게시합니다:

```bash
$ docker run -P nginx
```

## 직접 해보기 {#Try-it-out}

이 실습 가이드에서는 CLI와 Docker Compose를 사용하여 웹 애플리케이션을 배포하는 방법을 배웁니다.

### Docker CLI 사용 {#Use-the-Docker-CLI}

이 단계에서는 Docker CLI를 사용하여 컨테이너를 실행하고 포트를 게시합니다.

1. [Docker Desktop 다운로드 및 설치](/get-started/get-docker/).

2. 터미널에서 다음 명령어를 실행하여 새 컨테이너를 시작합니다:

   ```bash
   $ docker run -d -p 8080:80 docker/welcome-to-docker
   ```

   첫 번째 `8080`은 호스트 포트를 나타냅니다. 이는 컨테이너 내부에서 실행 중인 애플리케이션에 액세스하기 위해 로컬 머신에서 사용할 포트입니다. 두 번째 `80`은 컨테이너 포트를 나타냅니다. 이는 컨테이너 내부의 애플리케이션이 들어오는 연결을 수신 대기하는 포트입니다. 따라서 명령어는 호스트의 포트 `8080`을 컨테이너 시스템의 포트 `80`에 바인딩합니다.

3. Docker Desktop 대시보드의 **Containers** 보기에서 게시된 포트를 확인합니다.

   ![게시된 포트를 보여주는 Docker Desktop 대시보드의 스크린샷](images/published-ports.webp?w=5000&border=true)

4. **Port(s)** 열의 링크를 선택하거나 브라우저에서 [http://localhost:8080](http://localhost:8080)을 방문하여 웹사이트를 엽니다.

   ![컨테이너에서 실행 중인 Nginx 웹 서버의 랜딩 페이지 스크린샷](images/access-the-frontend.webp)

### Docker Compose 사용 {#Use-Docker-Compose}

이 예제에서는 Docker Compose를 사용하여 동일한 애플리케이션을 시작합니다:

1. 새 디렉토리를 만들고 해당 디렉토리 내에 다음 내용을 포함한 `compose.yaml` 파일을 만듭니다:

   ```yaml
   services:
     app:
       image: docker/welcome-to-docker
       ports:
         - 8080:80
   ```

   `ports` 구성은 포트 정의에 대해 몇 가지 다른 구문 형식을 허용합니다. 이 경우, `docker run` 명령어에서 사용한 것과 동일한 `HOST_PORT:CONTAINER_PORT`를 사용합니다.

2. 터미널을 열고 이전 단계에서 만든 디렉토리로 이동합니다.

3. `docker compose up` 명령어를 사용하여 애플리케이션을 시작합니다.

4. 브라우저에서 [http://localhost:8080](http://localhost:8080)을 엽니다.

## 추가 자료 {#Additional-resources}

이 주제에 대해 더 깊이 알아보고 싶다면 다음 자료를 확인하십시오:

- [`docker container port` CLI 참조](/reference/cli/docker/container/port/)
- [게시된 포트](/engine/network/#published-ports)

## 다음 단계 {#Next-steps}

이제 포트를 게시하고 노출하는 방법을 이해했으므로, `docker run` 명령어를 사용하여 컨테이너 기본값을 재정의하는 방법을 배울 준비가 되었습니다.

<Button href="overriding-container-defaults">컨테이너 기본값 재정의</Button>
