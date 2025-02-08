---
title: Docker Compose에서 환경 변수 우선순위
linkTitle: 환경 변수 우선순위
description: Compose에서 환경 변수가 해결되는 시나리오 개요
keywords:
  - compose
  - 환경
  - env 파일
weight: 20
aliases:
  - /compose/envvars-precedence/
  - /compose/environment-variables/envvars-precedence/
---

동일한 환경 변수가 여러 소스에서 설정된 경우 Docker Compose는 우선순위 규칙을 따라 컨테이너 환경에서 해당 변수의 값을 결정합니다.

이 페이지에는 환경 변수를 설정하는 각 방법의 우선순위 수준에 대한 정보가 포함되어 있습니다.

우선순위는 높은 것부터 낮은 것까지 다음과 같은 순서로 적용됩니다:

1. CLI에서 [`docker compose run -e`](set-environment-variables.md#set-environment-variables-with-docker-compose-run---env)를 사용하여 설정.
2. `environment` 또는 `env_file` 속성을 사용하여 설정하되, [셸](variable-interpolation.md#substitute-from-the-shell) 또는 환경 파일(기본 [`.env` 파일](variable-interpolation.md#env-file) 또는 CLI에서 [`--env-file` 인수](variable-interpolation.md#substitute-with---env-file))에서 값을 보간.
3. Compose 파일에서 [`environment` 속성](set-environment-variables.md#use-the-environment-attribute)을 사용하여 설정.
4. Compose 파일에서 [`env_file` 속성](set-environment-variables.md#use-the-env_file-attribute)을 사용하여 설정.
5. 컨테이너 이미지에서 [ENV 지시문](/reference/dockerfile.md#env)을 사용하여 설정.
   `Dockerfile`에 `ARG` 또는 `ENV` 설정이 있는 경우 `environment`, `env_file` 또는 `run --env`에 대한 Docker Compose 항목이 없는 경우에만 평가됩니다.

## 간단한 예제 {#simple-example}

다음 예제에서는 `.env` 파일과 Compose 파일의 `environment` 속성에 동일한 환경 변수에 대해 다른 값을 설정합니다:

```bash
$ cat ./webapp.env
NODE_ENV=test

$ cat compose.yml
services:
  webapp:
    image: 'webapp'
    env_file:
     - ./webapp.env
    environment:
     - NODE_ENV=production
```

`environment` 속성으로 정의된 환경 변수가 우선합니다.

```bash
$ docker compose run webapp env | grep NODE_ENV
NODE_ENV=production
```

## 고급 예제 {#advanced-example}

다음 표는 이미지 버전을 정의하는 환경 변수 `VALUE`를 예로 사용합니다.

### 표 작동 방식 {#how-the-table-works}

각 열은 `VALUE`에 대한 값을 설정하거나 대체할 수 있는 컨텍스트를 나타냅니다.

`Host OS environment` 및 `.env` 파일 열은 설명 목적으로만 나열됩니다. 실제로는 자체적으로 컨테이너에 변수를 생성하지 않지만 `environment` 또는 `env_file` 속성과 함께 사용됩니다.

각 행은 `VALUE`가 설정되거나 대체되거나 둘 다 설정된 컨텍스트 조합을 나타냅니다. **Result** 열은 각 시나리오에서 `VALUE`의 최종 값을 나타냅니다.

|  #  | `docker compose run` | `environment` 속성 | `env_file` 속성 | 이미지 `ENV` | `Host OS` 환경 | `.env` 파일 |     |      결과       |
| :-: | :------------------: | :----------------: | :-------------: | :----------: | :------------: | :---------: | :-: | :-------------: |
|  1  |          -           |         -          |        -        |      -       |  `VALUE=1.4`   | `VALUE=1.3` |     |        -        |
|  2  |          -           |         -          |   `VALUE=1.6`   | `VALUE=1.5`  |  `VALUE=1.4`   |      -      |     | **`VALUE=1.6`** |
|  3  |          -           |    `VALUE=1.7`     |        -        | `VALUE=1.5`  |  `VALUE=1.4`   |      -      |     | **`VALUE=1.7`** |
|  4  |          -           |         -          |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.5`** |
|  5  |  `--env VALUE=1.8`   |         -          |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.8`** |
|  6  |    `--env VALUE`     |         -          |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.4`** |
|  7  |    `--env VALUE`     |         -          |        -        | `VALUE=1.5`  |       -        | `VALUE=1.3` |     | **`VALUE=1.3`** |
|  8  |          -           |         -          |     `VALUE`     | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.4`** |
|  9  |          -           |         -          |     `VALUE`     | `VALUE=1.5`  |       -        | `VALUE=1.3` |     | **`VALUE=1.3`** |
| 10  |          -           |      `VALUE`       |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.4`** |
| 11  |          -           |      `VALUE`       |        -        | `VALUE=1.5`  |       -        | `VALUE=1.3` |     | **`VALUE=1.3`** |
| 12  |    `--env VALUE`     |    `VALUE=1.7`     |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.4`** |
| 13  |  `--env VALUE=1.8`   |    `VALUE=1.7`     |        -        | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.8`** |
| 14  |  `--env VALUE=1.8`   |         -          |   `VALUE=1.6`   | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.8`** |
| 15  |  `--env VALUE=1.8`   |    `VALUE=1.7`     |   `VALUE=1.6`   | `VALUE=1.5`  |  `VALUE=1.4`   | `VALUE=1.3` |     | **`VALUE=1.8`** |

### 결과 설명 {#result-explanation}

결과 1: 로컬 환경이 우선하지만 Compose 파일이 이를 컨테이너 내부에서 복제하도록 설정되지 않았으므로 해당 변수가 설정되지 않습니다.

결과 2: Compose 파일의 `env_file` 속성이 `VALUE`에 대한 명시적 값을 정의하므로 컨테이너 환경이 이에 따라 설정됩니다.

결과 3: Compose 파일의 `environment` 속성이 `VALUE`에 대한 명시적 값을 정의하므로 컨테이너 환경이 이에 따라 설정됩니다.

결과 4: 이미지의 `ENV` 지시문이 `VALUE` 변수를 선언하며, Compose 파일이 이 값을 재정의하도록 설정되지 않았으므로 이 변수는 이미지에 의해 정의됩니다.

결과 5: `docker compose run` 명령에 명시적 값을 설정하는 `--env` 플래그가 설정되어 있으며, 이미지에 설정된 값을 재정의합니다.

결과 6: `docker compose run` 명령에 로컬 환경에서 값을 복제하도록 설정된 `--env` 플래그가 있습니다. 호스트 OS 값이 우선하며 컨테이너 환경에 복제됩니다.

결과 7: `docker compose run` 명령에 로컬 환경에서 값을 복제하도록 설정된 `--env` 플래그가 있습니다. `.env` 파일의 값이 선택되어 컨테이너 환경을 정의합니다.

결과 8: Compose 파일의 `env_file` 속성이 로컬 환경에서 `VALUE`를 복제하도록 설정되어 있습니다. 호스트 OS 값이 우선하며 컨테이너 환경에 복제됩니다.

결과 9: Compose 파일의 `env_file` 속성이 로컬 환경에서 `VALUE`를 복제하도록 설정되어 있습니다. `.env` 파일의 값이 선택되어 컨테이너 환경을 정의합니다.

결과 10: Compose 파일의 `environment` 속성이 로컬 환경에서 `VALUE`를 복제하도록 설정되어 있습니다. 호스트 OS 값이 우선하며 컨테이너 환경에 복제됩니다.

결과 11: Compose 파일의 `environment` 속성이 로컬 환경에서 `VALUE`를 복제하도록 설정되어 있습니다. `.env` 파일의 값이 선택되어 컨테이너 환경을 정의합니다.

결과 12: `--env` 플래그는 `environment` 및 `env_file` 속성보다 높은 우선순위를 가지며 로컬 환경에서 `VALUE`를 복제하도록 설정되어 있습니다. 호스트 OS 값이 우선하며 컨테이너 환경에 복제됩니다.

결과 13에서 15: `--env` 플래그는 `environment` 및 `env_file` 속성보다 높은 우선순위를 가지며 값을 설정합니다.
