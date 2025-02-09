---
description: Docker Compose에 대한 자주 묻는 질문
keywords:
  - 문서
  - 도큐멘테이션
  - 도커
  - 컴포즈
  - FAQ
  - 도커 컴포즈 vs 도커-컴포즈
title: 컴포즈 FAQ
linkTitle: FAQs
weight: 10
tags: [FAQ]
aliases:
  - /compose/faq/
---

### `docker compose`와 `docker-compose`의 차이점은 무엇인가요? {#what-is-the-difference-between-docker-compose-and-docker-compose}

Docker Compose 명령줄 바이너리의 첫 번째 버전은 2014년에 처음 출시되었습니다. Python으로 작성되었으며 `docker-compose`로 호출됩니다. 일반적으로 Compose V1 프로젝트는 compose.yml 파일에 최상위 버전 요소를 포함하며, 값은 2.0에서 3.8까지 다양하며 특정 파일 형식을 나타냅니다.

Docker Compose 명령줄 바이너리의 두 번째 버전은 2020년에 발표되었으며, Go로 작성되었고 `docker compose`로 호출됩니다. Compose V2는 compose.yml 파일의 최상위 버전 요소를 무시합니다.

자세한 내용은 [Compose의 역사와 개발](/manuals/compose/intro/history.md)을 참조하세요.

### `up`, `run`, `start`의 차이점은 무엇인가요? {#whats-the-difference-between-up-run-and-start}

일반적으로 `docker compose up`을 사용합니다. `up`을 사용하여 `compose.yml`에 정의된 모든 서비스를 시작하거나 다시 시작합니다. 기본 "attached" 모드에서는 모든 컨테이너의 로그를 볼 수 있습니다. "분리된" 모드(`-d`)에서는 컨테이너를 시작한 후 Compose가 종료되지만 컨테이너는 백그라운드에서 계속 실행됩니다.

`docker compose run` 명령은 "일회성" 또는 "임시" 작업을 실행하기 위한 것입니다. 실행하려는 서비스 이름이 필요하며 실행 중인 서비스가 의존하는 서비스만 시작합니다. `run`을 사용하여 테스트를 실행하거나 데이터 볼륨 컨테이너에 데이터를 추가하거나 제거하는 등의 관리 작업을 수행합니다. `run` 명령은 `docker run -ti`처럼 작동하여 컨테이너에 대화형 터미널을 열고 컨테이너 내 프로세스의 종료 상태와 일치하는 종료 상태를 반환합니다.

`docker compose start` 명령은 이전에 생성되었지만 중지된 컨테이너를 다시 시작하는 데만 유용합니다. 새로운 컨테이너를 생성하지 않습니다.

### 내 서비스가 다시 생성되거나 중지되는 데 10초가 걸리는 이유는 무엇인가요? {#why-do-my-services-take-10-seconds-to-recreate-or-stop}

`docker compose stop` 명령은 `SIGTERM`을 보내 컨테이너를 중지하려고 시도합니다. 그런 다음 [기본 타임아웃 10초](/reference/cli/docker/compose/stop.md)를 기다립니다. 타임아웃 후, 컨테이너를 강제로 종료하기 위해 `SIGKILL`이 전송됩니다. 이 타임아웃을 기다리고 있다면 컨테이너가 `SIGTERM` 신호를 받을 때 종료되지 않는다는 의미입니다.

이 문제에 대해 이미 많은 글이 작성되었습니다. [컨테이너에서 신호를 처리하는 프로세스](https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86)에 대해 읽어보세요.

이 문제를 해결하려면 다음을 시도하세요:

- Dockerfile에서 `CMD` 및 `ENTRYPOINT`의 exec 형식을 사용하고 있는지 확인하세요.

  예를 들어 `["program", "arg1", "arg2"]`를 사용하고 `"program arg1 arg2"`를 사용하지 마세요.
  문자열 형식을 사용하면 Docker가 신호를 제대로 처리하지 않는 `bash`를 사용하여 프로세스를 실행합니다. Compose는 항상 JSON 형식을 사용하므로 Compose 파일에서 명령이나 엔트리포인트를 재정의해도 걱정하지 마세요.

- 가능하다면 실행 중인 애플리케이션을 수정하여 `SIGTERM`에 대한 명시적 신호를 처리하세요.

- 애플리케이션이 처리할 수 있는 신호로 `stop_signal`을 설정하세요:

  ```yaml
  services:
    web:
      build: .
      stop_signal: SIGINT
  ```

- 애플리케이션을 수정할 수 없는 경우, 애플리케이션을 경량 init 시스템(예: [s6](https://skarnet.org/software/s6/)) 또는 신호 프록시(예: [dumb-init](https://github.com/Yelp/dumb-init) 또는 [tini](https://github.com/krallin/tini))로 래핑하세요. 이러한 래퍼는 `SIGTERM`을 적절히 처리합니다.

### 동일한 호스트에서 Compose 파일의 여러 복사본을 실행하려면 어떻게 해야 하나요? {#how-do-i-run-multiple-copies-of-a-compose-file-on-the-same-host}

Compose는 프로젝트 이름을 사용하여 프로젝트의 모든 컨테이너 및 기타 리소스에 고유한 식별자를 생성합니다. 프로젝트의 여러 복사본을 실행하려면 `-p` 명령줄 옵션 또는 [`COMPOSE_PROJECT_NAME` 환경 변수](/manuals/compose/how-tos/environment-variables/envvars.md#compose_project_name)를 사용하여 사용자 정의 프로젝트 이름을 설정하세요.

### Compose 파일에 YAML 대신 JSON을 사용할 수 있나요? {#can-i-use-json-instead-of-yaml-for-my-compose-file}

네. [YAML은 JSON의 상위 집합](https://stackoverflow.com/a/1729545/444646)이므로 모든 JSON 파일은 유효한 YAML이어야 합니다. JSON 파일을 Compose에서 사용하려면 사용할 파일 이름을 지정하세요. 예를 들어:

```bash
$ docker compose -f docker-compose.json up
```

### `COPY`/`ADD` 또는 볼륨으로 코드를 포함해야 하나요? {#should-i-include-my-code-with-copy-add-or-a-volume}

`Dockerfile`에서 `COPY` 또는 `ADD` 지시어를 사용하여 이미지를 코드에 추가할 수 있습니다. 이는 코드를 다른 환경(프로덕션, CI 등)으로 전송할 때 Docker 이미지와 함께 코드를 이동해야 하는 경우에 유용합니다.

코드에 변경 사항을 반영하고 싶다면, 예를 들어 코드가 핫 코드 리로딩 또는 라이브 리로드를 지원하는 경우 개발 중에 `volume`을 사용하세요.

두 가지를 모두 사용해야 하는 경우도 있을 수 있습니다. 이미지를 사용하여 코드를 포함하고, 개발 중에 호스트의 코드를 포함하기 위해 Compose 파일에서 `volume`을 사용할 수 있습니다. 볼륨은 이미지의 디렉토리 내용을 덮어씁니다.
