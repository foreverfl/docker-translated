---
description: Docker Compose에서 서비스 시작 및 종료 순서 제어 방법
keywords:
  - 문서
  - 도커
  - 컴포즈
  - 시작
  - 종료
  - 순서
title: Compose에서 시작 및 종료 순서 제어
linkTitle: 시작 순서 제어
weight: 30
aliases:
  - /compose/startup-order/
---

서비스 시작 및 종료 순서는 [depends_on](/reference/compose-file/services.md#depends_on) 속성을 사용하여 제어할 수 있습니다. Compose는 항상 종속성 순서에 따라 컨테이너를 시작하고 중지합니다. 종속성은 `depends_on`, `links`, `volumes_from`, `network_mode: "service:..."`에 의해 결정됩니다.

이 기능을 사용할 수 있는 좋은 예는 데이터베이스에 액세스해야 하는 애플리케이션입니다. 두 서비스가 `docker compose up`으로 시작되면 애플리케이션 서비스가 데이터베이스 서비스보다 먼저 시작되어 SQL 문을 처리할 수 있는 데이터베이스를 찾지 못할 가능성이 있습니다.

## 시작 제어 {#control-startup}

시작 시 Compose는 컨테이너가 "준비"될 때까지 기다리지 않고 실행될 때까지 기다립니다. 예를 들어, 들어오는 연결을 처리하기 전에 자체 서비스를 시작해야 하는 관계형 데이터베이스 시스템이 있는 경우 문제가 발생할 수 있습니다.

서비스의 준비 상태를 감지하는 솔루션은 다음 옵션 중 하나와 함께 `condition` 속성을 사용하는 것입니다:

- `service_started`
- `service_healthy`. 종속 서비스가 시작되기 전에 종속성이 `healthcheck`로 정의된 대로 "건강"해야 함을 지정합니다.
- `service_completed_successfully`. 종속 서비스가 시작되기 전에 종속성이 성공적으로 완료되어야 함을 지정합니다.

## 예제 {#example}

```yaml
services:
  web:
    build: .
    depends_on:
      db:
        condition: service_healthy
        restart: true
      redis:
        condition: service_started
  redis:
    image: redis
  db:
    image: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      retries: 5
      start_period: 30s
      timeout: 10s
```

Compose는 종속성 순서에 따라 서비스를 생성합니다. `db`와 `redis`가 `web`보다 먼저 생성됩니다.

Compose는 `service_healthy`로 표시된 종속성의 헬스체크가 통과할 때까지 기다립니다. `db`는 `web`이 생성되기 전에 "건강"해야 합니다(`healthcheck`에 의해 표시됨).

`restart: true`는 `db`가 명시적인 Compose 작업으로 인해 업데이트되거나 재시작되는 경우(예: `docker compose restart`) `web` 서비스도 자동으로 재시작되어 연결 또는 종속성을 올바르게 다시 설정하도록 보장합니다.

`db` 서비스의 헬스체크는 `pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}` 명령을 사용하여 PostgreSQL 데이터베이스가 준비되었는지 확인합니다. 서비스는 10초마다 최대 5번 재시도됩니다.

Compose는 종속성 순서에 따라 서비스를 제거합니다. `web`이 `db` 및 `redis`보다 먼저 제거됩니다.

## 참고 정보 {#reference-information}

- [`depends_on`](/reference/compose-file/services.md#depends_on)
- [`healthcheck`](/reference/compose-file/services.md#healthcheck)
