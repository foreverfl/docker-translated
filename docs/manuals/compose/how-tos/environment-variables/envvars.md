---
description: Docker Compose에서 미리 정의된 환경 변수를 설정하거나 변경하기
keywords:
  - fig
  - 구성
  - compose
  - docker
  - 오케스트레이션
  - cli
  - 참조
title: Docker Compose에서 미리 정의된 환경 변수를 설정하거나 변경하기
linkTitle: 미리 정의된 환경 변수
weight: 30
aliases:
  - /compose/reference/envvars/
  - /compose/environment-variables/envvars/
---

Compose에는 이미 미리 정의된 환경 변수가 포함되어 있습니다. 또한 `DOCKER_HOST` 및 `DOCKER_CONTEXT`와 같은 일반적인 Docker CLI 환경 변수를 상속합니다. 자세한 내용은 [Docker CLI 환경 변수 참조](/reference/cli/docker/#environment-variables)를 참조하십시오.

이 페이지에는 필요에 따라 다음과 같은 미리 정의된 환경 변수를 설정하거나 변경하는 방법에 대한 정보가 포함되어 있습니다:

- `COMPOSE_PROJECT_NAME`
- `COMPOSE_FILE`
- `COMPOSE_PROFILES`
- `COMPOSE_CONVERT_WINDOWS_PATHS`
- `COMPOSE_PATH_SEPARATOR`
- `COMPOSE_IGNORE_ORPHANS`
- `COMPOSE_REMOVE_ORPHANS`
- `COMPOSE_PARALLEL_LIMIT`
- `COMPOSE_ANSI`
- `COMPOSE_STATUS_STDOUT`
- `COMPOSE_ENV_FILES`
- `COMPOSE_MENU`
- `COMPOSE_EXPERIMENTAL`

## 재정의 방법 {#methods-to-override}

미리 정의된 환경 변수를 설정하거나 변경할 수 있습니다:

- [작업 디렉토리에 있는 `.env` 파일로](/manuals/compose/how-tos/environment-variables/variable-interpolation.md)
- 명령줄에서
- [쉘에서](variable-interpolation.md#substitute-from-the-shell)

환경 변수를 변경하거나 설정할 때 [환경 변수 우선순위](envvars-precedence.md)를 확인하십시오.

## 구성 {#configure}

### COMPOSE_PROJECT_NAME {#compose_project_name}

프로젝트 이름을 설정합니다. 이 값은 시작 시 서비스 이름과 함께 컨테이너 이름에 추가됩니다.

예를 들어, 프로젝트 이름이 `myapp`이고 두 개의 서비스 `db`와 `web`이 포함된 경우, Compose는 각각 `myapp-db-1` 및 `myapp-web-1`이라는 이름의 컨테이너를 시작합니다.

Compose는 여러 가지 방법으로 프로젝트 이름을 설정할 수 있습니다. 각 방법의 우선순위(높은 순서에서 낮은 순서)는 다음과 같습니다:

1. `-p` 명령줄 플래그
2. `COMPOSE_PROJECT_NAME`
3. 구성 파일의 최상위 `name:` 변수(또는 `-f`를 사용하여 지정된 일련의 구성 파일 중 마지막 `name:`)
4. 구성 파일이 포함된 프로젝트 디렉토리의 `basename`(또는 `-f`를 사용하여 지정된 첫 번째 구성 파일이 포함된 디렉토리)
5. 구성 파일이 지정되지 않은 경우 현재 디렉토리의 `basename`

프로젝트 이름은 소문자, 십진수, 대시 및 밑줄만 포함해야 하며 소문자 또는 십진수로 시작해야 합니다. 프로젝트 디렉토리 또는 현재 디렉토리의 `basename`이 이 제약 조건을 위반하는 경우 다른 메커니즘 중 하나를 사용해야 합니다.

[명령줄 옵션 개요](/reference/cli/docker/compose/_index.md#command-options-overview-and-help) 및 [프로젝트 이름을 지정하기 위해 `-p` 사용](/reference/cli/docker/compose/_index.md#use--p-to-specify-a-project-name)도 참조하십시오.

### COMPOSE_FILE {#compose_file}

Compose 파일의 경로를 지정합니다. 여러 Compose 파일을 지정하는 것이 지원됩니다.

- 기본 동작: 제공되지 않은 경우, Compose는 현재 디렉토리에서 `compose.yaml`이라는 파일을 찾고, 찾지 못하면 각 상위 디렉토리를 재귀적으로 검색하여 해당 이름의 파일을 찾습니다.
- 여러 Compose 파일을 지정할 때 경로 구분자는 기본적으로 다음과 같습니다:

  - Mac 및 Linux: `:` (콜론)
  - Windows: `;` (세미콜론)
    예를 들어:

    ```bash
    COMPOSE_FILE=docker-compose.yml:docker-compose.prod.yml
    ```

    경로 구분자는 [`COMPOSE_PATH_SEPARATOR`](#compose_path_separator)를 사용하여 사용자 정의할 수도 있습니다.

[명령줄 옵션 개요](/reference/cli/docker/compose/_index.md#command-options-overview-and-help) 및 [하나 이상의 Compose 파일의 이름과 경로를 지정하기 위해 `-f` 사용](/reference/cli/docker/compose/_index.md#use--f-to-specify-name-and-path-of-one-or-more-compose-files)도 참조하십시오.

### COMPOSE_PROFILES {#compose_profiles}

`docker compose up`이 실행될 때 활성화할 하나 이상의 프로필을 지정합니다.

일치하는 프로필이 있는 서비스와 프로필이 정의되지 않은 모든 서비스가 시작됩니다.

예를 들어, `COMPOSE_PROFILES=frontend`로 `docker compose up`을 호출하면 `frontend` 프로필과 일치하는 서비스 및 프로필이 지정되지 않은 모든 서비스가 선택됩니다.

여러 프로필을 지정할 때는 쉼표를 구분자로 사용하십시오.

다음 예제는 `frontend` 및 `debug` 프로필과 일치하는 모든 서비스와 프로필이 없는 서비스를 활성화합니다.

```bash
COMPOSE_PROFILES=frontend,debug
```

[Compose에서 프로필 사용](../profiles.md) 및 [`--profile` 명령줄 옵션](/reference/cli/docker/compose/_index.md#use---profile-to-specify-one-or-more-active-profiles)도 참조하십시오.

### COMPOSE_CONVERT_WINDOWS_PATHS {#compose_convert_windows_paths}

활성화되면 Compose는 볼륨 정의에서 Windows 스타일 경로를 Unix 스타일로 변환합니다.

- 지원되는 값:
  - `true` 또는 `1`, 활성화
  - `false` 또는 `0`, 비활성화
- 기본값: `0`

### COMPOSE_PATH_SEPARATOR {#compose_path_separator}

`COMPOSE_FILE`에 나열된 항목에 대한 다른 경로 구분자를 지정합니다.

- 기본값:
  - macOS 및 Linux에서는 `:`
  - Windows에서는 `;`

### COMPOSE_IGNORE_ORPHANS {#compose_ignore_orphans}

활성화되면 Compose는 프로젝트의 불필요하게 남아 있는 컨테이너를 감지하려고 하지 않습니다.

- 지원되는 값:
  - `true` 또는 `1`, 활성화
  - `false` 또는 `0`, 비활성화
- 기본값: `0`

### COMPOSE_REMOVE_ORPHANS {#compose_remove_orphans}

활성화되면 Compose는 서비스를 업데이트하거나 스택을 업데이트할 때 자동으로 불필요하게 남아 있는 컨테이너를 제거합니다. 불필요하게 남아 있는 컨테이너는 이전 구성에 의해 생성되었지만 현재 `compose.yaml` 파일에 더 이상 정의되지 않은 컨테이너입니다.

- 지원되는 값:
  - `true` 또는 `1`, 불필요하게 남아 있는 컨테이너의 자동 제거 활성화
  - `false` 또는 `0`, 자동 제거 비활성화. Compose는 대신 불필요하게 남아 있는 컨테이너에 대한 경고를 표시합니다.
- 기본값: `0`

### COMPOSE_PARALLEL_LIMIT {#compose_parallel_limit}

동시 엔진 호출에 대한 최대 병렬 수준을 지정합니다.

### COMPOSE_ANSI {#compose_ansi}

ANSI 제어 문자를 출력할 시기를 지정합니다.

- 지원되는 값:
  - `auto`, Compose는 TTY 모드를 사용할 수 있는지 감지합니다. 그렇지 않으면 일반 텍스트 모드를 사용합니다.
  - `never`, 일반 텍스트 모드 사용
  - `always` 또는 `0`, TTY 모드 사용
- 기본값: `auto`

### COMPOSE_STATUS_STDOUT {#compose_status_stdout}

활성화되면 Compose는 내부 상태 및 진행 메시지를 `stderr` 대신 `stdout`에 씁니다.
기본값은 Compose 메시지와 컨테이너 로그 간의 출력 스트림을 명확하게 구분하기 위해 false입니다.

- 지원되는 값:
  - `true` 또는 `1`, 활성화
  - `false` 또는 `0`, 비활성화
- 기본값: `0`

### COMPOSE_ENV_FILES {#compose_env_files}

`--env-file`이 사용되지 않은 경우 Compose가 사용할 환경 파일을 지정합니다.

여러 환경 파일을 사용할 때는 쉼표를 구분자로 사용하십시오. 예를 들어:

```bash
COMPOSE_ENV_FILES=.env.envfile1, .env.envfile2
```

`COMPOSE_ENV_FILES`가 설정되지 않고 CLI에서 `--env-file`을 제공하지 않으면 Docker Compose는 프로젝트 디렉토리에서 `.env` 파일을 찾는 기본 동작을 사용합니다.

### COMPOSE_MENU {#compose_menu}

활성화되면 Compose는 탐색 메뉴를 표시하여 Docker Desktop에서 Compose 스택을 열거나 [`watch` 모드](../file-watch.md)를 켜거나 [Docker Debug](/reference/cli/docker/debug.md)를 사용할 수 있습니다.

- 지원되는 값:
  - `true` 또는 `1`, 활성화
  - `false` 또는 `0`, 비활성화
- 기본값: Docker Desktop을 통해 Docker Compose를 얻은 경우 `1`, 그렇지 않으면 기본값은 `0`

### COMPOSE_EXPERIMENTAL {#compose_experimental}

이것은 옵트아웃 변수입니다. 비활성화되면 탐색 메뉴 또는 [동기화된 파일 공유](/manuals/desktop/features/synchronized-file-sharing.md)와 같은 실험적 기능이 비활성화됩니다.

- 지원되는 값:
  - `true` 또는 `1`, 활성화
  - `false` 또는 `0`, 비활성화
- 기본값: `1`

## Compose V2에서 지원되지 않음 {#unsupported-in-compose-v2}

다음 환경 변수는 Compose V2에서 효과가 없습니다.
자세한 내용은 [Compose V2로 마이그레이션](/manuals/compose/releases/migrate.md)을 참조하십시오.

- `COMPOSE_API_VERSION`
  기본적으로 API 버전은 서버와 협상됩니다. `DOCKER_API_VERSION`을 사용하십시오.  
   [Docker CLI 환경 변수 참조](/reference/cli/docker/#environment-variables) 페이지를 참조하십시오.
- `COMPOSE_HTTP_TIMEOUT`
- `COMPOSE_TLS_VERSION`
- `COMPOSE_FORCE_WINDOWS_HOST`
- `COMPOSE_INTERACTIVE_NO_CLI`
- `COMPOSE_DOCKER_CLI_BUILD`
  `DOCKER_BUILDKIT`을 사용하여 BuildKit과 클래식 빌더 간에 선택하십시오. `DOCKER_BUILDKIT=0`인 경우 `docker compose build`는 이미지를 빌드하기 위해 클래식 빌더를 사용합니다.
