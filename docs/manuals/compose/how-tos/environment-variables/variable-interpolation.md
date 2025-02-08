---
title: 컴포즈 파일에서 변수 설정, 사용 및 관리 (Interpolation)
linkTitle: Interpolation
description: 컴포즈 파일에서 변수를 설정, 사용 및 관리하는 방법 (Interpolation)
keywords:
  - 컴포즈
  - 오케스트레이션
  - 환경 변수
  - 인터폴레이션
weight: 40
aliases:
  - /compose/env-file/
  - /compose/environment-variables/env-file/
  - /compose/environment-variables/variable-interpolation/
---

컴포즈 파일은 변수를 사용하여 더 많은 유연성을 제공합니다. 여러 버전을 테스트하기 위해 이미지 태그를 빠르게 전환하거나 로컬 환경에 맞게 볼륨 소스를 조정하려면 매번 컴포즈 파일을 편집할 필요 없이 런타임에 값을 삽입하는 변수를 설정할 수 있습니다.

인터폴레이션은 런타임에 값을 컴포즈 파일에 삽입하는 데 사용할 수 있으며, 이는 컨테이너의 환경 변수에 변수를 전달하는 데 사용됩니다.

아래는 간단한 예제입니다:

```bash
$ cat .env
TAG=v1.5
$ cat compose.yml
services:
  web:
    image: "webapp:${TAG}"
```

`docker compose up`을 실행하면 컴포즈 파일에 정의된 `web` 서비스가 `.env` 파일에 설정된 `webapp:v1.5` 이미지를 [인터폴레이션](variable-interpolation.md)합니다. 이를 확인하려면 터미널에 해결된 애플리케이션 구성을 출력하는 [config 명령어](/reference/cli/docker/compose/config.md)를 사용할 수 있습니다:

```bash
$ docker compose config
services:
  web:
    image: 'webapp:v1.5'
```

## 인터폴레이션 구문 {#interpolation-syntax}

인터폴레이션은 따옴표가 없는 값과 이중 따옴표가 있는 값에 적용됩니다.
중괄호(`${VAR}`)와 중괄호가 없는(`$VAR`) 표현식이 모두 지원됩니다.

중괄호 표현식의 경우 다음 형식이 지원됩니다:

- 직접 대체
  - `${VAR}` -> `VAR`의 값
- 기본값
  - `${VAR:-default}` -> `VAR`이 설정되고 비어 있지 않으면 `VAR`의 값, 그렇지 않으면 `default`
  - `${VAR-default}` -> `VAR`이 설정되어 있으면 `VAR`의 값, 그렇지 않으면 `default`
- 필수 값
  - `${VAR:?error}` -> `VAR`이 설정되고 비어 있지 않으면 `VAR`의 값, 그렇지 않으면 오류로 종료
  - `${VAR?error}` -> `VAR`이 설정되어 있으면 `VAR`의 값, 그렇지 않으면 오류로 종료
- 대체 값
  - `${VAR:+replacement}` -> `VAR`이 설정되고 비어 있지 않으면 `replacement`, 그렇지 않으면 빈 값
  - `${VAR+replacement}` -> `VAR`이 설정되어 있으면 `replacement`, 그렇지 않으면 빈 값

자세한 내용은 컴포즈 사양의 [Interpolation](/reference/compose-file/interpolation.md)을 참조하십시오.

## 인터폴레이션으로 변수를 설정하는 방법 {#ways-to-set-variables-with-interpolation}

Docker Compose는 여러 소스에서 컴포즈 파일에 변수를 인터폴레이션할 수 있습니다.

동일한 변수가 여러 소스에서 선언된 경우 우선순위가 적용됩니다:

1. 셸 환경의 변수
2. `--env-file`이 설정되지 않은 경우 로컬 작업 디렉토리(`PWD`)의 `.env` 파일에 설정된 변수
3. `--env-file`로 설정된 파일 또는 프로젝트 디렉토리의 `.env` 파일에서 설정된 변수

`docker compose config --environment`를 실행하여 컴포즈 모델을 인터폴레이션하는 데 사용된 변수와 값을 확인할 수 있습니다.

### `.env` 파일 {#env-file}

Docker Compose의 `.env` 파일은 `docker compose up`을 실행할 때 인터폴레이션을 위해 사용할 변수를 정의하는 텍스트 파일입니다. 이 파일은 일반적으로 변수의 키-값 쌍을 포함하며, 구성 관리를 한 곳에서 중앙 집중화하고 관리할 수 있게 해줍니다. `.env` 파일은 여러 변수를 저장해야 하는 경우 유용합니다.

`.env` 파일은 변수를 설정하는 기본 방법입니다. `.env` 파일은 프로젝트 디렉토리의 루트에 `compose.yaml` 파일 옆에 배치해야 합니다. 환경 파일 형식에 대한 자세한 내용은 [환경 파일 구문](#env-file-syntax)을 참조하십시오.

기본 예제:

```bash
$ cat .env
## DEV_MODE에 따라 COMPOSE_DEBUG를 정의하며, 기본값은 false입니다.
COMPOSE_DEBUG=${DEV_MODE:-false}

$ cat compose.yaml
  services:
    webapp:
      image: my-webapp-image
      environment:
        - DEBUG=${COMPOSE_DEBUG}

$ DEV_MODE=true docker compose config
services:
  webapp:
    environment:
      DEBUG: "true"
```

#### 추가 정보 {#additional-information}

- `.env` 파일에 변수를 정의하면 [`environment` 속성](/reference/compose-file/services.md#environment)으로 `compose.yml`에서 직접 참조할 수 있습니다. 예를 들어, `.env` 파일에 환경 변수 `DEBUG=1`이 포함되어 있고 `compose.yml` 파일이 다음과 같다면:

  ```yaml
  services:
    webapp:
      image: my-webapp-image
      environment:
        - DEBUG=${DEBUG}
  ```

  Docker Compose는 `.env` 파일의 값으로 `${DEBUG}`를 대체합니다.

  :::important
  컨테이너의 환경 변수로 `.env` 파일의 변수를 사용할 때 [환경 변수 우선순위](envvars-precedence.md)를 유의하십시오.
  :::

- `.env` 파일을 프로젝트 디렉토리의 루트가 아닌 다른 위치에 배치하고 [`--env-file` 옵션](#substitute-with---env-file)을 사용하여 Compose가 해당 위치로 이동할 수 있습니다.

- `.env` 파일은 다른 `.env` 파일로 [대체될 수 있습니다](#substitute-with---env-file).

:::important
`.env` 파일에서의 대체는 Docker Compose CLI 기능입니다.

`docker stack deploy`를 실행할 때 Swarm에서는 지원되지 않습니다.
:::

#### `.env` 파일 구문 {#env-file-syntax}

환경 파일에는 다음 구문 규칙이 적용됩니다:

- `#`로 시작하는 줄은 주석으로 처리되어 무시됩니다.
- 빈 줄은 무시됩니다.
- 따옴표가 없는 값과 이중 따옴표(`"`) 값에는 인터폴레이션이 적용됩니다.
- 각 줄은 키-값 쌍을 나타냅니다. 값은 선택적으로 따옴표로 묶을 수 있습니다.
  - `VAR=VAL` -> `VAL`
  - `VAR="VAL"` -> `VAL`
  - `VAR='VAL'` -> `VAL`
- 따옴표가 없는 값의 인라인 주석은 공백으로 시작해야 합니다.
  - `VAR=VAL # 주석` -> `VAL`
  - `VAR=VAL# 주석 아님` -> `VAL# 주석 아님`
- 따옴표가 있는 값의 인라인 주석은 닫는 따옴표 뒤에 있어야 합니다.
  - `VAR="VAL # 주석 아님"` -> `VAL # 주석 아님`
  - `VAR="VAL" # 주석` -> `VAL`
- 단일 따옴표(`'`) 값은 문자 그대로 사용됩니다.
  - `VAR='$OTHER'` -> `$OTHER`
  - `VAR='${OTHER}'` -> `${OTHER}`
- 따옴표는 `\`로 이스케이프할 수 있습니다.
  - `VAR='Let\'s go!'` -> `Let's go!`
  - `VAR="{\"hello\": \"json\"}"` -> `{"hello": "json"}`
- 이중 따옴표 값에서는 `\n`, `\r`, `\t`, `\\` 등의 일반적인 셸 이스케이프 시퀀스가 지원됩니다.
  - `VAR="some\tvalue"` -> `some  value`
  - `VAR='some\tvalue'` -> `some\tvalue`
  - `VAR=some\tvalue` -> `some\tvalue`

### `--env-file`로 대체 {#substitute-with---env-file}

여러 환경 변수에 대한 기본값을 `.env` 파일에 설정한 다음 CLI에서 파일을 인수로 전달할 수 있습니다.

이 방법의 장점은 파일을 어디에나 저장하고 적절하게 이름을 지정할 수 있다는 것입니다. 예를 들어, Docker Compose 명령어가 실행되는 현재 작업 디렉토리에 상대적인 파일 경로입니다. 파일 경로는 `--env-file` 옵션을 사용하여 전달됩니다:

```bash
$ docker compose --env-file ./config/.env.dev up
```

#### 추가 정보 {#additional-information}

- 이 방법은 이미 `compose.yml` 파일에서 참조된 `.env` 파일을 일시적으로 재정의하려는 경우 유용합니다. 예를 들어, 프로덕션(`.env.prod`) 및 테스트(`.env.test`)용으로 다른 `.env` 파일이 있을 수 있습니다.
  다음 예제에서는 두 개의 환경 파일, `.env` 및 `.env.dev`가 있습니다. 두 파일 모두 `TAG`에 대해 다른 값을 설정합니다.
  ```bash
  $ cat .env
  TAG=v1.5
  $ cat ./config/.env.dev
  TAG=v1.6
  $ cat compose.yml
  services:
    web:
      image: "webapp:${TAG}"
  ```
  명령줄에서 `--env-file`이 사용되지 않으면 기본적으로 `.env` 파일이 로드됩니다:
  ```bash
  $ docker compose config
  services:
    web:
      image: 'webapp:v1.5'
  ```
  `--env-file` 인수를 전달하면 기본 파일 경로가 재정의됩니다:
  ```bash
  $ docker compose --env-file ./config/.env.dev config
  services:
    web:
      image: 'webapp:v1.6'
  ```
  잘못된 파일 경로가 `--env-file` 인수로 전달되면 Compose는 오류를 반환합니다:
  ```bash
  $ docker compose --env-file ./doesnotexist/.env.dev  config
  ERROR: Couldn't find env file: /home/user/./doesnotexist/.env.dev
  ```
- 여러 `--env-file` 옵션을 사용하여 여러 환경 파일을 지정할 수 있으며, Docker Compose는 순서대로 읽습니다. 나중에 지정된 파일이 이전 파일의 변수를 재정의할 수 있습니다.
  ```bash
  $ docker compose --env-file .env --env-file .env.override up
  ```
- 컨테이너를 시작할 때 명령줄에서 특정 환경 변수를 재정의할 수 있습니다.
  ```bash
  $ docker compose --env-file .env.dev up -e DATABASE_URL=mysql://new_user:new_password@new_db:3306/new_database
  ```

### 로컬 `.env` 파일 대 `<프로젝트 디렉토리>` `.env` 파일 {#local-env-file-versus-project-directory-env-file}

`.env` 파일은 컴포즈 동작을 제어하고 로드할 파일을 선언하는 [사전 정의된 환경 변수](envvars.md)를 선언하는 데에도 사용할 수 있습니다.

명시적인 `--env-file` 플래그 없이 실행되면 Compose는 작업 디렉토리([PWD](https://www.gnu.org/software/bash/manual/html_node/Bash-Variables.html#index-PWD))에서 `.env` 파일을 검색하고 값을 로드합니다.
자체 구성 및 인터폴레이션을 위해. 이 파일의 값이 `COMPOSE_FILE` 사전 정의 변수를 정의하여 프로젝트 디렉토리가 다른 폴더로 설정되면
두 번째 `.env` 파일이 있으면 로드됩니다. 이 두 번째 `.env` 파일의 우선순위는 낮습니다.

이 메커니즘을 통해 명령줄에서 환경 변수를 전달할 필요 없이 사용자 정의 변수 세트를 재정의로 사용하여 기존 컴포즈 프로젝트를 호출할 수 있습니다.

```bash
$ cat .env
COMPOSE_FILE=../compose.yaml
POSTGRES_VERSION=9.3

$ cat ../compose.yaml
services:
  db:
    image: "postgres:${POSTGRES_VERSION}"
$ cat ../.env
POSTGRES_VERSION=9.2

$ docker compose config
services:
  db:
    image: "postgres:9.3"
```

### 셸에서 대체 {#substitute-from-the-shell}

호스트 머신의 기존 환경 변수 또는 `docker compose` 명령어를 실행하는 셸 환경에서 기존 환경 변수를 사용할 수 있습니다. 이를 통해 런타임에 Docker Compose 구성에 동적으로 값을 주입할 수 있습니다.
예를 들어, 셸에 `POSTGRES_VERSION=9.3`이 포함되어 있고 다음 구성을 제공한다고 가정합니다:

```yaml
db:
  image: "postgres:${POSTGRES_VERSION}"
```

이 구성을 사용하여 `docker compose up`을 실행하면 Compose는 셸에서 `POSTGRES_VERSION` 환경 변수를 찾아 값을 대체합니다. 이 예제에서는 Compose가 실행하기 전에 이미지를 `postgres:9.3`으로 변환합니다.

환경 변수가 설정되지 않은 경우 Compose는 빈 문자열로 대체합니다. 이전 예제에서 `POSTGRES_VERSION`이 설정되지 않은 경우 이미지 옵션의 값은 `postgres:`입니다.

:::note
`postgres:`는 유효한 이미지 참조가 아닙니다. Docker는 태그가 없는 참조(`postgres`, 기본적으로 최신 이미지) 또는 태그가 있는 참조(`postgres:15`)를 기대합니다.
:::