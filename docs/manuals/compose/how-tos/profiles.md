---
title: Compose에서 프로필 사용
linkTitle: 서비스 프로필 사용
weight: 20
description: Docker Compose에서 프로필을 사용하는 방법
keywords:
  - cli
  - compose
  - 프로필
  - 프로필 참조
aliases:
  - /compose/profiles/
---

<Include file="compose/profiles.md" />

## 서비스에 프로필 할당 {#Assigning-profiles-to-services}

서비스는 프로필 이름 배열을 받는 [`profiles` 속성](/reference/compose-file/services.md#profiles)을 통해 프로필과 연결됩니다:

```yaml
services:
  frontend:
    image: frontend
    profiles: [frontend]

  phpmyadmin:
    image: phpmyadmin
    depends_on: [db]
    profiles: [debug]

  backend:
    image: backend

  db:
    image: mysql
```

여기서 `frontend` 및 `phpmyadmin` 서비스는 각각 `frontend` 및 `debug` 프로필에 할당되며, 해당 프로필이 활성화될 때만 시작됩니다.

`profiles` 속성이 없는 서비스는 항상 활성화됩니다. 이 경우 `docker compose up`을 실행하면 `backend` 및 `db`만 시작됩니다.

유효한 프로필 이름은 `[a-zA-Z0-9][a-zA-Z0-9_.-]+` 형식을 따릅니다.

:::tip
애플리케이션의 핵심 서비스는 항상 활성화되고 자동으로 시작되도록 `profiles`를 할당하지 않는 것이 좋습니다.
:::

## 특정 프로필 시작 {#Start-specific-profiles}

특정 프로필을 시작하려면 `--profile` [명령줄 옵션](/reference/cli/docker/compose.md)을 제공하거나 [`COMPOSE_PROFILES` 환경 변수](environment-variables/envvars.md#compose_profiles)를 사용하십시오:

```bash
$ docker compose --profile debug up
```

```bash
$ COMPOSE_PROFILES=debug docker compose up
```

두 명령 모두 `debug` 프로필이 활성화된 서비스를 시작합니다.
이전 `compose.yml` 파일에서는 `db`, `backend` 및 `phpmyadmin` 서비스를 시작합니다.

### 여러 프로필 시작 {#Start-multiple-profiles}

여러 프로필을 활성화할 수도 있습니다. 예를 들어 `docker compose --profile frontend --profile debug up`을 사용하면 `frontend` 및 `debug` 프로필이 활성화됩니다.

여러 프로필은 여러 `--profile` 플래그를 전달하거나 `COMPOSE_PROFILES` 환경 변수에 쉼표로 구분된 목록을 사용하여 지정할 수 있습니다:

```bash
$ docker compose --profile frontend --profile debug up
```

```bash
$ COMPOSE_PROFILES=frontend,debug docker compose up
```

모든 프로필을 동시에 활성화하려면 `docker compose --profile "*"`을 실행할 수 있습니다.

## 프로필 자동 시작 및 종속성 해결 {#Auto-starting-profiles-and-dependency-resolution}

`profiles`가 할당된 서비스가 명령줄에서 명시적으로 대상이 되는 경우 해당 프로필이 자동으로 시작되므로 수동으로 시작할 필요가 없습니다. 이는 일회성 서비스 및 디버깅 도구에 사용할 수 있습니다.
다음 구성 예제를 고려하십시오:

```yaml
services:
  backend:
    image: backend

  db:
    image: mysql

  db-migrations:
    image: backend
    command: myapp migrate
    depends_on:
      - db
    profiles:
      - tools
```

```sh
# backend 및 db만 시작
$ docker compose up -d

# db-migrations를 실행하고 (필요한 경우 db를 시작)
# `tools` 프로필을 암시적으로 활성화
$ docker compose run db-migrations
```

그러나 `docker compose`는 명령줄의 서비스 프로필만 자동으로 시작하며 종속성의 프로필은 자동으로 시작하지 않습니다.

이는 대상 서비스가 `depends_on`하는 다른 모든 서비스가 다음 중 하나여야 함을 의미합니다:

- 공통 프로필 공유
- `profiles`를 생략하거나 명시적으로 시작된 일치하는 프로필을 가지고 항상 시작됨

```yaml
services:
  web:
    image: web

  mock-backend:
    image: backend
    profiles: ["dev"]
    depends_on:
      - db

  db:
    image: mysql
    profiles: ["dev"]

  phpmyadmin:
    image: phpmyadmin
    profiles: ["debug"]
    depends_on:
      - db
```

```sh
# "web"만 시작
$ docker compose up -d

# mock-backend 시작 (필요한 경우 db 시작)
# `dev` 프로필을 암시적으로 활성화
$ docker compose up -d mock-backend

# 이 작업은 실패합니다. 왜냐하면 "dev" 프로필이 활성화되지 않았기 때문입니다.
$ docker compose up phpmyadmin
```

`phpmyadmin`을 대상으로 하면 `debug` 프로필이 자동으로 시작되지만, `db`에 필요한 `dev` 프로필은 자동으로 시작되지 않습니다.

이를 해결하려면 `db` 서비스에 `debug` 프로필을 추가해야 합니다:

```yaml
db:
  image: mysql
  profiles: ["debug", "dev"]
```

또는 `dev` 프로필을 명시적으로 시작해야 합니다:

```bash
# `phpmyadmin`을 대상으로 하면 "debug" 프로필이 자동으로 시작됩니다.
$ docker compose --profile dev up phpmyadmin
$ COMPOSE_PROFILES=dev docker compose up phpmyadmin
```

## 특정 프로필 중지 {#Stop-specific-profiles}

특정 프로필을 시작할 때와 마찬가지로 `--profile` [명령줄 옵션](/reference/cli/docker/compose.md#use--p-to-specify-a-project-name)을 사용하거나 [`COMPOSE_PROFILES` 환경 변수](environment-variables/envvars.md#compose_profiles)를 사용할 수 있습니다:

```bash
$ docker compose --profile debug down
```

```bash
$ COMPOSE_PROFILES=debug docker compose down
```

두 명령 모두 `debug` 프로필이 있는 서비스를 중지하고 제거합니다. 다음 `compose.yml` 파일에서는 `db` 및 `phpmyadmin` 서비스를 중지합니다.

```yaml
services:
  frontend:
    image: frontend
    profiles: [frontend]

  phpmyadmin:
    image: phpmyadmin
    depends_on: [db]
    profiles: [debug]

  backend:
    image: backend

  db:
    image: mysql
```

:::note
`docker compose down`을 실행하면 `backend` 및 `db`만 중지됩니다.
:::

## 참조 정보 {#Reference-information}

[`profiles`](/reference/compose-file/services.md#profiles)
