---
title: 컨테이너 환경 내 환경 변수 설정
linkTitle: 환경 변수 설정
weight: 10
description: Compose를 사용하여 환경 변수를 설정, 사용 및 관리하는 방법
keywords:
  - compose
  - 오케스트레이션
  - 환경
  - 환경 변수
  - 컨테이너 환경 변수
aliases:
  - /compose/env/
  - /compose/link-env-deprecated/
  - /compose/environment-variables/set-environment-variables/
---

컨테이너의 환경은 서비스 구성에 명시적인 항목이 있을 때까지 설정되지 않습니다. Compose를 사용하면 Compose 파일에서 컨테이너의 환경 변수를 설정하는 두 가지 방법이 있습니다.

:::tip
비밀번호와 같은 민감한 정보를 컨테이너에 전달하기 위해 환경 변수를 사용하지 마십시오. 대신 [secrets](../use-secrets.md)을 사용하십시오.
:::

## `environment` 속성 사용 {#use-the-environment-attribute}

`compose.yml`에서 [`environment` 속성](/reference/compose-file/services.md#environment)을 사용하여 컨테이너의 환경 변수에 직접 설정할 수 있습니다.

리스트 및 매핑 구문을 모두 지원합니다:

```yaml
services:
  webapp:
    environment:
      DEBUG: "true" # 디버그 모드 활성화
```

다음과 동일합니다:

```yaml
services:
  webapp:
    environment:
      - DEBUG=true # 디버그 모드 활성화
```

[`environment` 속성](/reference/compose-file/services.md#environment)에서 더 많은 예제를 확인할 수 있습니다.

### 추가 정보 {#additional-information}

- 값을 설정하지 않고 셸에서 환경 변수를 컨테이너로 직접 전달할 수 있습니다. 이는 `docker run -e VARIABLE ...`와 동일한 방식으로 작동합니다:

  ```yaml
  web:
    environment:
      - DEBUG # 셸에서 DEBUG 변수 가져오기
  ```

  이 경우 셸 환경에서 `DEBUG` 변수가 설정되지 않은 경우 경고가 발생하지 않습니다.

- [변수 보간](variable-interpolation.md#interpolation-syntax)을 활용할 수도 있습니다. 다음 예제에서는 셸 환경 또는 프로젝트 디렉토리의 `.env` 파일에 `DEBUG` 변수가 설정되지 않은 경우 Compose가 경고를 제공합니다.

  ```yaml
  web:
    environment:
      - DEBUG=${DEBUG} # 셸 또는 .env 파일에서 DEBUG 변수 가져오기
  ```

## `env_file` 속성 사용 {#use-the-env_file-attribute}

컨테이너의 환경은 [`env_file` 속성](/reference/compose-file/services.md#env_file)과 함께 [`.env` 파일](variable-interpolation.md#env-file)을 사용하여 설정할 수도 있습니다.

```yaml
services:
  webapp:
    env_file: "webapp.env" # 환경 변수 파일 사용
```

`.env` 파일을 사용하면 동일한 파일을 `docker run --env-file ...` 명령으로 사용하거나 여러 서비스에서 동일한 `.env` 파일을 공유할 수 있습니다.

또한 환경 변수를 주요 구성 파일과 분리하여 보다 조직적이고 안전한 방식으로 민감한 정보를 관리할 수 있습니다. 프로젝트 디렉토리의 루트에 `.env` 파일을 배치할 필요가 없습니다.

[`env_file` 속성](/reference/compose-file/services.md#env_file)을 사용하면 Compose 애플리케이션에서 여러 `.env` 파일을 사용할 수 있습니다.

`env_file` 속성에 지정된 `.env` 파일의 경로는 `compose.yml` 파일의 위치를 기준으로 상대적입니다.

:::important
`.env` 파일의 보간은 Docker Compose CLI 기능입니다.

`docker run --env-file ...`을 실행할 때는 지원되지 않습니다.
:::

### 추가 정보 {#additional-information}

- 여러 파일이 지정된 경우 순서대로 평가되며 이전 파일에 설정된 값을 덮어쓸 수 있습니다.
- Docker Compose 버전 2.24.0부터 `env_file` 속성으로 정의된 `.env` 파일을 `required` 필드를 사용하여 선택적으로 설정할 수 있습니다. `required`가 `false`로 설정되고 `.env` 파일이 누락된 경우 Compose는 항목을 무시합니다.
  ```yaml
  env_file:
    - path: ./default.env
      required: true # 기본값
    - path: ./override.env
      required: false
  ```
- Docker Compose 버전 2.30.0부터 `env_file`에 대해 `format` 속성을 사용하여 대체 파일 형식을 사용할 수 있습니다. 자세한 내용은 [`format`](/reference/compose-file/services.md#format)을 참조하십시오.
- `.env` 파일의 값은 [`docker compose run -e`](#set-environment-variables-with-docker-compose-run---env)를 사용하여 명령줄에서 재정의할 수 있습니다.

## `docker compose run --env`로 환경 변수 설정 {#set-environment-variables-with-docker-compose-run---env}

`docker run --env`와 유사하게 `docker compose run --env` 또는 짧은 형식인 `docker compose run -e`를 사용하여 환경 변수를 일시적으로 설정할 수 있습니다:

```bash
$ docker compose run -e DEBUG=1 web python console.py  # 디버그 모드로 실행
```

### 추가 정보 {#additional-information}

- 값을 제공하지 않고 셸 또는 환경 파일에서 변수를 전달할 수도 있습니다:

  ```bash
  $ docker compose run -e DEBUG web python console.py  # 셸 또는 환경 파일에서 DEBUG 변수 가져오기
  ```

컨테이너의 `DEBUG` 변수 값은 Compose가 실행되는 셸 또는 환경 파일의 동일한 변수 값에서 가져옵니다.

## 추가 자료 {#further-resources}

- [환경 변수 우선순위 이해하기](envvars-precedence.md).
- [미리 정의된 환경 변수 설정 또는 변경](envvars.md)
- [모범 사례 탐색](best-practices.md)
- [보간 이해하기](variable-interpolation.md)
